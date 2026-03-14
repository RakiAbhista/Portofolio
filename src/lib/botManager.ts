import type { Bot } from "mineflayer";
import type { WebSocket } from "ws";
import { PrismaClient } from "@prisma/client";

/**
 * Configuration for creating a Mineflayer bot instance
 */
export interface BotConfig {
  id: string;
  botUsername: string;
  serverIp: string;
  serverPort: number;
  version?: string;
}

/**
 * Runtime state of a bot instance with WebSocket connections
 */
export interface BotInstance {
  bot: Bot;
  connections: Set<WebSocket>;
  lastError?: string;
  createdAt: Date;
  status: "initializing" | "online" | "error"; // Track bot connection status
}

/**
 * Queue for WebSocket connections waiting for bot to be ready
 */
interface PendingConnection {
  botId: string;
  ws: WebSocket;
  timestamp: number;
}

/**
 * Global registry for active bot instances
 * Using globalThis to persist across Next.js Hot Reloading
 */
const globalForBots = globalThis as unknown as { 
  activeBots: Map<string, BotInstance>;
  pendingConnections: PendingConnection[];
};
const activeBots = globalForBots.activeBots || new Map<string, BotInstance>();
const pendingConnections = globalForBots.pendingConnections || [];

if (process.env.NODE_ENV !== "production") {
  globalForBots.activeBots = activeBots;
  globalForBots.pendingConnections = pendingConnections;
}

// Prisma client for database updates
const prisma = new PrismaClient();

/**
 * Create and initialize a Mineflayer bot instance with robust error handling
 * @param config Bot configuration
 * @returns Promise<Bot | null>
 */
export async function createBot(config: BotConfig): Promise<Bot | null> {
  try {
    // Import mineflayer dynamically
    const mineflayer = await import("mineflayer");

    console.log(`🤖 Creating bot: ${config.botUsername} connecting to ${config.serverIp}:${config.serverPort}`);

    const bot = mineflayer.createBot({
      host: config.serverIp,
      port: config.serverPort,
      username: config.botUsername,
      version: config.version,
      auth: "offline", // Use offline mode for most servers
      hideErrors: false, // Show all errors for debugging
    });

    // ✨ Monkey-patch: Handle PartialReadError from custom items/NBT components
    // This prevents bot crash from malformed packet data (common in 1.20.5+)
    (bot as any)._client.on('error', (err: any) => {
      // Ignore PartialReadError from protodef (custom items, equipment, etc)
      if (err?.message?.includes('Read error for undefined') || err?.message?.includes('PartialReadError')) {
        console.warn(`[${config.botUsername}] ⚠️ Ignoring PartialReadError (likely due to custom items/NBT components in 1.20.5+)`);
        return; // Prevent crash
      }
      
      // Log other client errors
      console.error(`[${config.botUsername}] ❌ Client Error:`, err);
    });

    // 🛡️ AGGRESSIVE: Intercept emit() to prevent packet parsing errors from crashing
    // This is necessary for Minecraft 1.20.5+ with custom items
    if ((bot as any)._client) {
      console.log(`[${config.botUsername}] 🛡️ Installing emit() override for NBT error handling...`);
      
      const clientInstance = (bot as any)._client;
      const originalEmit = clientInstance.emit.bind(clientInstance);
      
      clientInstance.emit = function (eventName: string | symbol, ...args: any[]) {
        if (eventName === 'error') {
          const err = args[0];
          // Check if error is related to NBT/Item parsing
          if (err && err.message && (
            err.message.includes('PartialReadError') || 
            err.message.includes('Read error for undefined') ||
            err.message.includes('window_items') ||
            err.message.includes('set_slot')
          )) {
            console.warn(`[${config.botUsername}] ⚠️ Suppressing NBT packet error: ${err.message.split('\n')[0]}`);
            return false; // Prevent error from propagating
          }
        }
        return originalEmit(eventName, ...args);
      };
      
      console.log(`[${config.botUsername}] ✅ NBT error suppression active`);
    }

    // 👇 PLAN D: SADAP RAW PACKET DARI JARINGAN
    if ((bot as any)._client) {
      (bot as any)._client.on('packet', (data: any, meta: any) => {
        try {
          if (meta.name === 'system_chat' || meta.name === 'player_chat' || meta.name === 'chat') {
            // Mencoba mengekstrak pesan dari buffer mentah
            let chatText = "";
            if (data.content) {
              const contentStr = typeof data.content === 'string' ? data.content : JSON.stringify(data.content);
              // Hapus format JSON aneh bawaan Minecraft agar mudah dibaca di terminal
              chatText = contentStr.replace(/\{"text":"(.*?)"\}/g, "$1").replace(/["{}]/g, ""); 
            } else if (data.plainMessage) {
              chatText = data.plainMessage;
            } else if (data.message) {
              chatText = data.message;
            }
            
            if (chatText && chatText.trim() !== "") {
               console.log(`⚡ [RAW NETWORK CHAT] ${chatText}`);
            }
          }
        } catch (e) {
          // Abaikan error parser
        }
      });
    }
    // 👆 SAMPAI SINI 👆

    // Create bot instance wrapper
    const instance: BotInstance = {
      bot,
      connections: new Set(),
      createdAt: new Date(),
      status: "initializing", // Start with initializing status
    };

    // Store in registry
    activeBots.set(config.id, instance);

    // Setup event listeners
    setupBotListeners(config.id, bot, instance.connections);

    return bot;
  } catch (error) {
    console.error(`❌ Failed to create bot ${config.id}:`, error);
    
    // Update database with error status
    try {
      await prisma.minecraftBot.update({
        where: { id: config.id },
        data: {
          status: "error"
        }
      });
    } catch (dbError) {
      console.error("Failed to update bot status in database:", dbError);
    }
    
    return null;
  }
}

/**
 * Setup listeners for a bot instance with comprehensive event handling
 */
function setupBotListeners(botId: string, bot: Bot, connections: Set<WebSocket>) {
  // Login/Connected event
  bot.on("login", () => {
    console.log(`✅ Bot ${botId} logged in`);
    
    // Update instance status to online
    const instance = activeBots.get(botId);
    if (instance) {
      instance.status = "online";
    }
    
    updateBotStatus(botId, "online");
    broadcastToConnections(connections, {
      type: "status",
      status: "online",
      message: "Bot logged in to server",
      timestamp: new Date().toISOString()
    });
    
    // ✨ Process waiting connections now that bot is ready
    processPendingConnections(botId);
  });

  // Spawn event - Update database immediately
  bot.on("spawn", () => {
    console.log(`🌍 Bot ${botId} spawned at X: ${bot.entity?.position?.x}, Y: ${bot.entity?.position?.y}, Z: ${bot.entity?.position?.z}`);
    updateBotStatus(botId, "spawned");
    broadcastToConnections(connections, {
      type: "status",
      status: "spawned",
      message: "Bot spawned in world",
      position: bot.entity?.position,
      timestamp: new Date().toISOString()
    });
  });

  // Menggunakan "messagestr" untuk menangkap SEMUA jenis pesan di Minecraft
  bot.on("messagestr", (message: string, messagePosition: string, jsonMsg: any) => {
    // Abaikan jika pesan kosong
    if (!message || message.trim() === "") return;

    // Abaikan pesan buatan bot sendiri
    if (message.includes(`<${bot.username}>`)) return;

    console.log(`💬 [${botId}] MENGIRIM KE UI: ${message}`);
    
    // Broadcast pesan ke UI ChatSidebar
    broadcastToConnections(connections, {
      type: "chat",
      username: "System", // Karena ini bisa dari mana saja (Server/Player)
      message: message,
      isOwnMessage: false,
      timestamp: new Date().toISOString()
    });
  });

  // Whisper/private messages
  bot.on("whisper", (username: string, message: string) => {
    console.log(`[${botId}] (whisper from ${username}) ${message}`);
    broadcastToConnections(connections, {
      type: "whisper",
      username,
      message,
      timestamp: new Date().toISOString()
    });
  });

  // =========================================================
  // BYPASS BUG BUNGEECORD (MENIRU CHATCRAFT)
  // =========================================================
  if ((bot as any)._client) {
    // Tangkap paket Resource Pack mentah dari server (versi 1.20.3+)
    (bot as any)._client.on('add_resource_pack', (data: any) => {
      console.log(`\n📦 [${botId}] RAW RESOURCE PACK TERTANGKAP!`);
      console.log(`UUID: ${data.uuid}`);
      
      try {
        // 1. Balas ke BungeeCord: "Saya ACCEPT resource pack ini" (result: 3)
        // Kita wajib menyertakan UUID mentah dari server agar tidak BadPacket
        (bot as any)._client.write('resource_pack_receive', { 
          uuid: data.uuid, 
          result: 3 
        });
        
        // 2. Balas lagi: "Saya SUDAH SELESAI download & load" (result: 0)
        setTimeout(() => {
          (bot as any)._client.write('resource_pack_receive', { 
            uuid: data.uuid, 
            result: 0 
          });
          console.log(`✅ [${botId}] Respons palsu berhasil dikirim! Bot aman dari kick.`);
        }, 500); // Jeda setengah detik biar terlihat natural seperti ChatCraft

      } catch (err) {
        console.error(`⚠️ Gagal mengirim raw packet:`, err);
      }
    });

    // Untuk berjaga-jaga jika server menggunakan format paket lama (1.20.2 ke bawah)
    (bot as any)._client.on('resource_pack_send', (data: any) => {
      console.log(`📦 [${botId}] Format Resource Pack lama tertangkap.`);
      try {
        (bot as any)._client.write('resource_pack_receive', { result: 3 });
        (bot as any)._client.write('resource_pack_receive', { result: 0 });
      } catch (e) {}
    });
  }
  // =========================================================

  // Kicked event
  bot.on("kicked", (reason: any) => {
    const instance = activeBots.get(botId);
    console.log(`\n🔴🔴🔴 ALASAN SERVER MENENDANG BOT 🔴🔴🔴`);
    try {
      console.log(JSON.stringify(reason, null, 2));
    } catch (e) {
      const util = require('util');
      console.log(util.inspect(reason, { showHidden: false, depth: null, colors: true }));
    }
    console.log(`🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴\n`);
    
    if (instance) {
      instance.status = "error";
      instance.lastError = `Kicked from server`;
    }
    
    broadcastToConnections(connections, {
      type: "kicked",
      message: `Bot dikeluarkan dari server!`
    });
    
    updateBotStatus(botId, "kicked");
    // Auto-disconnect after being kicked
    setTimeout(() => disconnectBot(botId), 1000);
  });

  // End event (disconnected)
  bot.on("end", (reason?: string) => {
    console.log(`🔌 Bot ${botId} disconnected: ${reason || "unknown reason"}`);
    updateBotStatus(botId, "offline");
    broadcastToConnections(connections, {
      type: "status",
      status: "offline",
      message: `Bot disconnected: ${reason || "Connection lost"}`,
      timestamp: new Date().toISOString()
    });
    activeBots.delete(botId);
  });

  // Error event - Critical error handling
  bot.on("error", (error: Error) => {
    console.error(`❌ Bot ${botId} error:`, error.message);
    
    const instance = activeBots.get(botId);
    if (instance) {
      instance.lastError = error.message;
      instance.status = "error"; // Set status to error
    }
    
    updateBotStatus(botId, "error", error.message);
    
    broadcastToConnections(connections, {
      type: "error",
      message: error.message,
      timestamp: new Date().toISOString()
    });

    // Handle specific error types
    if (error.message.includes("ECONNREFUSED")) {
      console.error(`[${botId}] Server refused connection - check IP/port`);
    } else if (error.message.includes("ETIMEDOUT")) {
      console.error(`[${botId}] Connection timeout - server may be offline`);
    } else if (error.message.includes("PartialReadError")) {
      console.error(`[${botId}] Protocol error - may need to specify version`);
    }
  });

  // Death event
  bot.on("death", () => {
    console.log(`💀 Bot ${botId} died`);
    broadcastToConnections(connections, {
      type: "status",
      status: "dead",
      message: "Bot died, respawning...",
      timestamp: new Date().toISOString()
    });
  });

  // Health/hunger changes
  bot.on("health", () => {
    broadcastToConnections(connections, {
      type: "stats",
      health: bot.health,
      hunger: bot.food,
      saturation: bot.foodSaturation,
      timestamp: new Date().toISOString()
    });
  });

  // Movement tracking
  bot.on("move", () => {
    // Throttle position updates - only send every 500ms to avoid spam
    // This could be improved with a debounce mechanism
  });
}

/**
 * Send message (chat) from bot
 */
export function sendBotMessage(botId: string, message: string): boolean {
  const instance = activeBots.get(botId);
  if (!instance) {
    console.error(`❌ Bot ${botId} not found in active bots. Active bots: ${Array.from(activeBots.keys()).join(", ") || "none"}`);
    return false;
  }

  try {
    instance.bot.chat(message);
    console.log(`💬 [${botId}] BOT SENT: ${message}`);
    
    // Broadcast own message to all clients with isOwnMessage: true
    console.log(`📢 [${botId}] Broadcasting sent message, connections.size=${instance.connections.size}`);
    broadcastToConnections(instance.connections, {
      type: "chat",
      username: instance.bot.username,
      message,
      isOwnMessage: true,
      timestamp: new Date().toISOString()
    });
    
    return true;
  } catch (error) {
    console.error(`Failed to send message from bot ${botId}:`, error);
    return false;
  }
}

/**
 * Update bot status in database
 */
async function updateBotStatus(botId: string, status: "online" | "offline" | "spawned" | "error" | "kicked" | "dead", errorMessage?: string): Promise<void> {
  try {
    const updateData: any = { status };
    
    await prisma.minecraftBot.update({
      where: { id: botId },
      data: updateData
    });
  } catch (error) {
    console.error(`Failed to update bot status in database for ${botId}:`, error);
  }
}

/**
 * Execute a command as bot
 */
export function executeBotCommand(botId: string, command: string): boolean {
  const instance = activeBots.get(botId);
  if (!instance) {
    console.error(`Bot ${botId} not found`);
    return false;
  }

  try {
    // Commands typically start with / in Minecraft
    const fullCommand = command.startsWith("/") ? command : `/${command}`;
    instance.bot.chat(fullCommand);
    console.log(`[${botId}] Command executed: ${fullCommand}`);
    return true;
  } catch (error) {
    console.error(`Failed to execute command for bot ${botId}:`, error);
    return false;
  }
}

/**
 * Disconnect and remove a bot
 */
export function disconnectBot(botId: string): void {
  const instance = activeBots.get(botId);
  if (!instance) {
    console.warn(`Bot ${botId} not found`);
    return;
  }

  try {
    console.log(`🛑 Disconnecting bot: ${botId}`);
    instance.bot.quit();
    activeBots.delete(botId);
    console.log(`✓ Bot ${botId} disconnected`);
  } catch (error) {
    console.error(`Error disconnecting bot ${botId}:`, error);
    activeBots.delete(botId);
  }
}

/**
 * Register a WebSocket connection for a bot
 * If bot is not ready, add to pending queue
 */
export function registerConnection(botId: string, ws: WebSocket): void {
  const instance = activeBots.get(botId);
  
  if (instance) {
    // Bot is ready
    instance.connections.add(ws);
    console.log(`✅ WebSocket registered for bot: ${botId} (connections: ${instance.connections.size})`);
    
    // Send status confirmation if bot is online
    if (instance.status === "online") {
      ws.send(JSON.stringify({
        type: "status",
        status: "ready",
        message: "Bot is ready for chat",
        timestamp: new Date().toISOString()
      }));
    }
  } else {
    // Bot not found - add to pending queue
    console.warn(`⏳ Bot ${botId} not ready yet. Adding WebSocket to pending queue...`);
    
    pendingConnections.push({
      botId,
      ws,
      timestamp: Date.now()
    });
    
    // Send retry status to client
    try {
      ws.send(JSON.stringify({
        type: "status",
        status: "connecting",
        message: "Bot is initializing... please wait",
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error("Failed to send connecting status:", error);
    }
    
    // Set timeout to remove stale pending connections (30 seconds)
    setTimeout(() => {
      const index = pendingConnections.findIndex(
        (p) => p.botId === botId && p.ws === ws
      );
      if (index !== -1) {
        console.warn(`⏱️ Pending connection timeout for bot: ${botId}`);
        pendingConnections.splice(index, 1);
        try {
          ws.send(JSON.stringify({
            type: "error",
            message: "Bot initialization timeout",
            timestamp: new Date().toISOString()
          }));
          ws.close(1000, "Bot initialization timeout");
        } catch (e) {
          // WebSocket already closed
        }
      }
    }, 30000);
  }
}

/**
 * Process pending connections when bot is ready
 */
function processPendingConnections(botId: string): void {
  const instance = activeBots.get(botId);
  if (!instance) return;
  
  // Filter connections for this bot
  const pendingForThisBot = pendingConnections.filter((p) => p.botId === botId);
  
  if (pendingForThisBot.length === 0) return;
  
  console.log(`🔄 Processing ${pendingForThisBot.length} pending connections for bot: ${botId}`);
  
  // Register all pending connections
  pendingForThisBot.forEach(({ ws }) => {
    try {
      instance.connections.add(ws);
      
      // Send ready status
      ws.send(JSON.stringify({
        type: "status",
        status: "ready",
        message: "Bot is ready for chat",
        timestamp: new Date().toISOString()
      }));
      
      console.log(`✅ Pending connection registered for bot: ${botId}`);
    } catch (error) {
      console.error("Failed to register pending connection:", error);
    }
  });
  
  // Remove from pending queue
  for (let i = pendingConnections.length - 1; i >= 0; i--) {
    if (pendingConnections[i].botId === botId) {
      pendingConnections.splice(i, 1);
    }
  }
}

/**
 * Unregister a WebSocket connection
 */
export function unregisterConnection(botId: string, ws: WebSocket): void {
  const instance = activeBots.get(botId);
  if (instance) {
    instance.connections.delete(ws);
    console.log(`✅ WebSocket unregistered for bot: ${botId} (remaining: ${instance.connections.size})`);
  }
  
  // Also remove from pending queue if present
  const pendingIndex = pendingConnections.findIndex(
    (p) => p.botId === botId && p.ws === ws
  );
  if (pendingIndex !== -1) {
    pendingConnections.splice(pendingIndex, 1);
    console.log(`✅ Pending connection removed for bot: ${botId}`);
  }
}

/**
 * Get bot instance
 */
export function getBot(botId: string): Bot | null {
  return activeBots.get(botId)?.bot || null;
}

/**
 * Check if bot is active
 */
export function isBotActive(botId: string): boolean {
  return activeBots.has(botId);
}

/**
 * Get all active bot IDs
 */
export function getActiveBots(): string[] {
  return Array.from(activeBots.keys());
}

/**
 * Broadcast message to all connections for a bot
 */
export function broadcastToConnections(connections: Set<WebSocket>, data: any): void {
  const message = JSON.stringify(data);
  
  // Debug logging
  if (data.type === "chat") {
    console.log(`📢 Broadcasting chat: connections.size=${connections.size}, message="${data.message}"`);
  }
  
  connections.forEach((ws) => {
    if (ws.readyState === 1) { // WebSocket.OPEN
      try {
        ws.send(message);
      } catch (error) {
        console.error("Failed to send message to WebSocket:", error);
        connections.delete(ws);
      }
    }
  });
}

/**
 * Get active bot instances for debugging
 */
export function getActiveBotInstances(): Array<{ botId: string; username: string; isSpawned: boolean }> {
  const instances: Array<{ botId: string; username: string; isSpawned: boolean }> = [];
  activeBots.forEach((instance, botId) => {
    instances.push({
      botId,
      username: instance.bot.username,
      isSpawned: !!instance.bot.entity
    });
  });
  return instances;
}

/**
 * Gracefully shutdown all bots
 */
export function shutdownAllBots(): void {
  console.log("🛑 Shutting down all bots...");
  console.log(`📊 Active bots at shutdown: ${activeBots.size}`);
  activeBots.forEach((instance, botId) => {
    try {
      instance.bot.quit();
    } catch (error) {
      console.error(`Error shutting down bot ${botId}:`, error);
    }
  });
  activeBots.clear();
  console.log("✓ All bots shut down");
}
