import express from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import next from "next";
import path from "path";
import { fileURLToPath } from "url";
import * as botManager from "./src/lib/botManager";
import { PrismaClient } from "@prisma/client";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = next({ dev: process.env.NODE_ENV !== "production" });
const handle = app.getRequestHandler();
const prisma = new PrismaClient();

const PORT = process.env.PORT || 3000;
const WS_PORT = process.env.WS_PORT || 3001;

// Map to track WebSocket connections per bot
const botConnections = new Map<string, Set<WebSocket>>();

/**
 * Register WebSocket connection for a bot
 */
function registerBotConnection(botId: string, ws: WebSocket): void {
  if (!botConnections.has(botId)) {
    botConnections.set(botId, new Set());
  }
  botConnections.get(botId)!.add(ws);
  console.log(`✅ WebSocket connection registered for bot: ${botId} (total: ${botConnections.get(botId)!.size})`);
}

/**
 * Unregister WebSocket connection for a bot
 */
function unregisterBotConnection(botId: string, ws: WebSocket): void {
  const connections = botConnections.get(botId);
  if (connections) {
    connections.delete(ws);
    if (connections.size === 0) {
      botConnections.delete(botId);
    }
    console.log(`📴 WebSocket connection removed for bot: ${botId}`);
  }
}

/**
 * Main application startup
 */
app.prepare().then(async () => {
  // Create HTTP server for Next.js
  const server = createServer((req, res) => {
    if (req.url?.startsWith("/api/")) {
      return handle(req, res);
    }
    return handle(req, res);
  });

  // Create WebSocket server on separate port
  const wsServer = createServer();
  const wss = new WebSocketServer({ server: wsServer, perMessageDeflate: false });

  /**
   * Handle new WebSocket connections
   */
  wss.on("connection", (ws, req) => {
    try {
      const url = new URL(req.url || "", `http://${req.headers.host}`);
      const botId = url.searchParams.get("botId");

      if (!botId) {
        console.warn("❌ WebSocket connection attempt without botId");
        ws.close(1008, "botId parameter required");
        return;
      }

      console.log(`\n📡 WebSocket connection for bot: ${botId}`);

      // Register connection with botManager to enable broadcast
      botManager.registerConnection(botId, ws);
      console.log(`✅ Connection registered with botManager for bot: ${botId}`);
      
      // Send welcome message
      ws.send(JSON.stringify({
        type: "status",
        status: "connected",
        message: `Connected to bot ${botId}`,
        timestamp: new Date().toISOString()
      }));

      /**
       * Handle incoming messages from client
       */
      ws.on("message", async (data) => {
        try {
          const message = data.toString().trim();

          if (message.length > 0) {
            // Try to parse as JSON first (for structured messages)
            let parsedData: any = null;
            try {
              parsedData = JSON.parse(message);
            } catch {
              // If not JSON, treat as plain chat message for backward compatibility
              parsedData = { type: "send_chat", message };
            }

            // Handle start_bot command - Bot Control from Frontend
            if (parsedData.type === "start_bot" && parsedData.config) {
              console.log(`🤖 Received start_bot command for: ${botId}`);
              
              try {
                const isActive = botManager.isBotActive(botId);
                if (isActive) {
                  ws.send(JSON.stringify({
                    type: "bot_control_response",
                    success: false,
                    message: "Bot is already running",
                    timestamp: new Date().toISOString()
                  }));
                  return;
                }

                const config = parsedData.config;
                console.log(`🚀 Creating bot: ${config.botUsername} → ${config.serverIp}:${config.serverPort}`);
                
                const bot = await botManager.createBot({
                  id: botId,
                  botUsername: config.botUsername,
                  serverIp: config.serverIp,
                  serverPort: config.serverPort,
                  version: config.version
                });

                if (!bot) {
                  ws.send(JSON.stringify({
                    type: "bot_control_response",
                    success: false,
                    message: "Failed to create bot instance",
                    timestamp: new Date().toISOString()
                  }));
                  return;
                }

                ws.send(JSON.stringify({
                  type: "bot_control_response",
                  success: true,
                  message: "Bot started successfully",
                  timestamp: new Date().toISOString()
                }));

                console.log(`✅ Bot ${botId} started successfully`);
              } catch (error) {
                console.error(`❌ Failed to start bot ${botId}:`, error);
                ws.send(JSON.stringify({
                  type: "bot_control_response",
                  success: false,
                  message: error instanceof Error ? error.message : "Failed to start bot",
                  timestamp: new Date().toISOString()
                }));
              }
            }
            // Handle stop_bot command - Bot Control from Frontend
            else if (parsedData.type === "stop_bot") {
              console.log(`🛑 Received stop_bot command for: ${botId}`);
              
              try {
                const isActive = botManager.isBotActive(botId);
                if (!isActive) {
                  ws.send(JSON.stringify({
                    type: "bot_control_response",
                    success: false,
                    message: "Bot is not running",
                    timestamp: new Date().toISOString()
                  }));
                  return;
                }

                botManager.disconnectBot(botId);
                
                ws.send(JSON.stringify({
                  type: "bot_control_response",
                  success: true,
                  message: "Bot stopped successfully",
                  timestamp: new Date().toISOString()
                }));

                console.log(`✅ Bot ${botId} stopped successfully`);
              } catch (error) {
                console.error(`❌ Failed to stop bot ${botId}:`, error);
                ws.send(JSON.stringify({
                  type: "bot_control_response",
                  success: false,
                  message: error instanceof Error ? error.message : "Failed to stop bot",
                  timestamp: new Date().toISOString()
                }));
              }
            }
            // Handle send_chat message type (Chat messages)
            else if (parsedData.type === "send_chat" && parsedData.message) {
              const success = botManager.sendBotMessage(botId, parsedData.message);
              
              if (!success) {
                ws.send(JSON.stringify({
                  type: "error",
                  message: `Failed to send message - bot ${botId} not found or not active`,
                  timestamp: new Date().toISOString()
                }));
              }
            } else {
              // Backward compatibility: treat plain text as chat
              const success = botManager.sendBotMessage(botId, message);
              
              if (!success) {
                ws.send(JSON.stringify({
                  type: "error",
                  message: `Failed to send message - bot ${botId} not found or not active`,
                  timestamp: new Date().toISOString()
                }));
              }
            }
          }
        } catch (error) {
          console.error(`❌ Error handling message for bot ${botId}:`, error);
          ws.send(JSON.stringify({
            type: "error",
            message: error instanceof Error ? error.message : "Failed to process message",
            timestamp: new Date().toISOString()
          }));
        }
      });

      /**
       * Handle client disconnect
       */
      ws.on("close", () => {
        console.log(`📴 WebSocket closed for bot: ${botId}`);
        botManager.unregisterConnection(botId, ws);
        console.log(`✅ Connection unregistered from botManager for bot: ${botId}`);
      });

      /**
       * Handle WebSocket errors
       */
      ws.on("error", (error) => {
        // Only log non-WS_ERR errors
        if (!error.message?.includes("WS_ERR")) {
          console.error(`❌ WebSocket error for bot ${botId}:`, error.message);
        }
      });
    } catch (error) {
      console.error("❌ Unexpected WebSocket error:", error);
      ws.close(1011, "Internal server error");
    }
  });

  /**
   * Handle WebSocket server errors
   */
  wss.on("error", (error) => {
    if (!error.message?.includes("WS_ERR")) {
      console.error("❌ WebSocket server error:", error);
    }
  });

  /**
   * API endpoint to start a bot
   * This will be called from the dashboard
   */
  const expressApp = express();
  expressApp.use(express.json());

  expressApp.post("/api/bots/:id/start", async (req, res) => {
    const { id } = req.params;

    try {
      // Fetch bot from database
      const bot = await prisma.minecraftBot.findUnique({ where: { id } });

      if (!bot) {
        return res.status(404).json({ error: "Bot not found" });
      }

      // Check if bot is already running
      if (botManager.isBotActive(id)) {
        return res.status(400).json({ error: "Bot is already running" });
      }

      // Create bot instance
      const mfBot = await botManager.createBot({
        id,
        botUsername: bot.botUsername,
        serverIp: bot.serverIp,
        serverPort: bot.serverPort,
        version: bot.version || undefined
      });

      if (!mfBot) {
        return res.status(500).json({ error: "Failed to create bot instance" });
      }

      res.json({ success: true, message: "Bot started" });
    } catch (error) {
      console.error("Error starting bot:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  expressApp.post("/api/bots/:id/stop", async (req, res) => {
    const { id } = req.params;

    try {
      botManager.disconnectBot(id);
      await prisma.minecraftBot.update({
        where: { id },
        data: { status: "offline" }
      });

      res.json({ success: true, message: "Bot stopped" });
    } catch (error) {
      console.error("Error stopping bot:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  /**
   * Graceful shutdown
   */
  process.on("SIGINT", async () => {
    console.log("\n🛑 Shutting down servers...");
    
    // Disconnect all bots
    botManager.shutdownAllBots();
    
    // Close Prisma connection
    await prisma.$disconnect();
    
    server.close(() => {
      wsServer.close(() => {
        console.log("✓ All servers closed");
        process.exit(0);
      });
    });
  });

  /**
   * Start servers
   */
  server.listen(PORT, (err?: Error) => {
    if (err) throw err;
    console.log(`
╭─────────────────────────────────────╮
│  🚀 Dashboard Bot Manager Ready      │
│  HTTP: http://localhost:${PORT}
│  WebSocket: ws://localhost:${WS_PORT}
│  Mineflayer Integration: ✅ Active
╰─────────────────────────────────────╯
    `);
  });

  wsServer.listen(WS_PORT, () => {
    console.log(`✅ WebSocket server listening on ws://localhost:${WS_PORT}`);
  });

  // Keep the reference for cleanup
  process.on("unhandledRejection", (reason, promise) => {
    console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
  });
});
