"use client";

import { useEffect, useState } from "react";
import { Plus, MessageSquare, Settings, Power, Trash2 } from "lucide-react";
import { ChatSidebar } from "@/components/ChatSidebar";
import { BotModal } from "@/components/BotModal";

interface MinecraftBot {
  id: string;
  botUsername: string;
  serverName: string;
  serverIp: string;
  serverPort: number;
  version: string | null;
  status: string;
  createdAt: string;
}

export default function BotsPage() {
  const [bots, setBots] = useState<MinecraftBot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBot, setEditingBot] = useState<MinecraftBot | null>(null);
  const [selectedBotId, setSelectedBotId] = useState<string | null>(null);

  // Fetch bots on mount
  useEffect(() => {
    const fetchBots = async () => {
      try {
        const res = await fetch("/api/bots");
        const data = await res.json();
        setBots(data);
      } catch (error) {
        console.error("Failed to fetch bots:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBots();
  }, []);

  const handleToggleBotStatus = async (bot: MinecraftBot) => {
    const newStatus = bot.status === "online" ? "offline" : "online";

    try {
      // ✨ Bot control is now via server.ts (port 3001) - single source of truth
      if (newStatus === "online") {
        // Start bot via WebSocket command to server.ts
        await startBotViaWebSocket(bot);
      } else {
        // Stop bot via WebSocket command to server.ts
        await stopBotViaWebSocket(bot);
      }

      // Update bot status in database for persistence
      const res = await fetch(`/api/bots/${bot.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        const updated = await res.json();
        setBots(bots.map((b) => (b.id === updated.id ? updated : b)));
        
        // If status is now online, open chat sidebar
        if (newStatus === "online") {
          setSelectedBotId(bot.id);
        }
      }
    } catch (error) {
      console.error("Failed to toggle bot status:", error);
      alert(error instanceof Error ? error.message : "Failed to toggle bot status");
    }
  };

  /**
   * Send start_bot command to server.ts via WebSocket
   */
  const startBotViaWebSocket = (bot: MinecraftBot): Promise<void> => {
    return new Promise((resolve, reject) => {
      const protocol = typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = typeof window !== 'undefined' ? window.location.host : 'localhost:3001';
      const wsUrl = `${protocol}//${host}?botId=${bot.id}`;
      const ws = new WebSocket(wsUrl);
      const timeout = setTimeout(() => {
        ws.close();
        reject(new Error("Bot start timeout - no response from server"));
      }, 10000); // 10 second timeout

      ws.onopen = () => {
        console.log(`🔌 WebSocket opened for bot control: ${bot.id}`);
        
        // Send start_bot command with bot config
        ws.send(JSON.stringify({
          type: "start_bot",
          config: {
            botUsername: bot.botUsername,
            serverIp: bot.serverIp,
            serverPort: bot.serverPort,
            version: bot.version
          }
        }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Check for bot_control_response
          if (data.type === "bot_control_response") {
            clearTimeout(timeout);
            
            if (data.success) {
              console.log(`✅ Bot started: ${data.message}`);
              resolve();
            } else {
              reject(new Error(data.message || "Failed to start bot"));
            }
            
            ws.close();
          }
        } catch (error) {
          console.error("Error parsing response:", error);
        }
      };

      ws.onerror = (error) => {
        clearTimeout(timeout);
        console.error(`❌ WebSocket error for bot ${bot.id}:`, error);
        reject(new Error("Failed to connect to bot control server"));
      };

      ws.onclose = () => {
        clearTimeout(timeout);
      };
    });
  };

  /**
   * Send stop_bot command to server.ts via WebSocket
   */
  const stopBotViaWebSocket = (bot: MinecraftBot): Promise<void> => {
    return new Promise((resolve, reject) => {
      const protocol = typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = typeof window !== 'undefined' ? window.location.host : 'localhost:3001';
      const wsUrl = `${protocol}//${host}?botId=${bot.id}`;
      const ws = new WebSocket(wsUrl);
      const timeout = setTimeout(() => {
        ws.close();
        reject(new Error("Bot stop timeout - no response from server"));
      }, 10000); // 10 second timeout

      ws.onopen = () => {
        console.log(`🔌 WebSocket opened for bot control: ${bot.id}`);
        
        // Send stop_bot command
        ws.send(JSON.stringify({
          type: "stop_bot"
        }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Check for bot_control_response
          if (data.type === "bot_control_response") {
            clearTimeout(timeout);
            
            if (data.success) {
              console.log(`✅ Bot stopped: ${data.message}`);
              resolve();
            } else {
              reject(new Error(data.message || "Failed to stop bot"));
            }
            
            ws.close();
          }
        } catch (error) {
          console.error("Error parsing response:", error);
        }
      };

      ws.onerror = (error) => {
        clearTimeout(timeout);
        console.error(`❌ WebSocket error for bot ${bot.id}:`, error);
        reject(new Error("Failed to connect to bot control server"));
      };

      ws.onclose = () => {
        clearTimeout(timeout);
      };
    });
  };

  const handleDeleteBot = async (id: string) => {
    if (!confirm("Are you sure you want to delete this bot?")) return;

    try {
      const res = await fetch(`/api/bots/${id}`, { method: "DELETE" });

      if (res.ok) {
        setBots(bots.filter((b) => b.id !== id));
        if (selectedBotId === id) {
          setSelectedBotId(null);
        }
      }
    } catch (error) {
      console.error("Failed to delete bot:", error);
    }
  };

  const handleBotAdded = (newBot: MinecraftBot) => {
    setBots([...bots, newBot]);
    setShowAddModal(false);
  };

  const handleBotUpdated = (updated: MinecraftBot) => {
    setBots(bots.map((b) => (b.id === updated.id ? updated : b)));
    setEditingBot(null);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading bots...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-8 overflow-y-auto flex-1">
          <div className="max-w-6xl">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold">Minecraft Bots</h1>
                <p className="text-muted-foreground mt-2">
                  Manage and monitor your Minecraft bot instances
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg transition"
              >
                <Plus className="h-5 w-5" />
                Add Bot
              </button>
            </div>

            {/* Bots Grid */}
            {bots.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No bots created yet</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg transition"
                >
                  <Plus className="h-5 w-5" />
                  Create Your First Bot
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {bots.map((bot) => (
                  <div
                    key={bot.id}
                    className="flex items-center gap-4 p-6 bg-card border border-border rounded-lg hover:border-primary/50 transition group"
                  >
                    {/* Bot Status Indicator */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className={`h-3 w-3 rounded-full ${
                            bot.status === "online" ? "bg-green-500" : "bg-gray-500"
                          }`}
                        />
                        <h3 className="font-bold text-lg">{bot.botUsername}</h3>
                        <span className="text-xs text-muted-foreground px-2 py-1 bg-secondary rounded">
                          {bot.serverName}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {bot.serverIp}:{bot.serverPort}
                        {bot.version && ` • Version: ${bot.version}`}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {/* Toggle Button */}
                      <button
                        onClick={() => handleToggleBotStatus(bot)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                          bot.status === "online"
                            ? "bg-green-500/20 hover:bg-green-500/30 text-green-600"
                            : "bg-secondary hover:bg-secondary/80 text-foreground"
                        }`}
                      >
                        <Power className="h-5 w-5" />
                        {bot.status === "online" ? "Online" : "Offline"}
                      </button>

                      {/* Chat Button */}
                      {bot.status === "online" && (
                        <button
                          onClick={() => setSelectedBotId(bot.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition"
                        >
                          <MessageSquare className="h-5 w-5" />
                        </button>
                      )}

                      {/* Settings Button */}
                      <button
                        onClick={() => setEditingBot(bot)}
                        className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition"
                      >
                        <Settings className="h-5 w-5" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteBot(bot.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-destructive/10 hover:bg-destructive/20 rounded-lg transition text-destructive"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Sidebar */}
      {selectedBotId && (
        <ChatSidebar
          botId={selectedBotId}
          onClose={() => setSelectedBotId(null)}
        />
      )}

      {/* Add/Edit Bot Modal */}
      {(showAddModal || editingBot) && (
        <BotModal
          bot={editingBot}
          onClose={() => {
            setShowAddModal(false);
            setEditingBot(null);
          }}
          onSave={editingBot ? handleBotUpdated : handleBotAdded}
        />
      )}
    </div>
  );
}
