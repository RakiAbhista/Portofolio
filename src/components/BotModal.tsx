"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

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

interface BotModalProps {
  bot?: MinecraftBot | null;
  onClose: () => void;
  onSave: (bot: MinecraftBot) => void;
}

export function BotModal({ bot, onClose, onSave }: BotModalProps) {
  const [formData, setFormData] = useState({
    botUsername: "",
    serverName: "",
    serverIp: "",
    serverPort: 25565,
    version: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pre-fill form if editing
  useEffect(() => {
    if (bot) {
      setFormData({
        botUsername: bot.botUsername,
        serverName: bot.serverName,
        serverIp: bot.serverIp,
        serverPort: bot.serverPort,
        version: bot.version || ""
      });
    }
  }, [bot]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const method = bot ? "PUT" : "POST";
      const url = bot ? `/api/bots/${bot.id}` : "/api/bots";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save bot");
      }

      const savedBot = await res.json();
      onSave(savedBot);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card border border-border rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {bot ? "Edit Bot Configuration" : "Add New Bot"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-secondary rounded-lg transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Bot Username */}
          <div>
            <label className="block text-sm font-medium mb-2">Bot Username</label>
            <input
              type="text"
              value={formData.botUsername}
              onChange={(e) =>
                setFormData({ ...formData, botUsername: e.target.value })
              }
              placeholder="MyAwesomeBot"
              disabled={loading}
              className="w-full px-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
              required
            />
          </div>

          {/* Server Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Server Name</label>
            <input
              type="text"
              value={formData.serverName}
              onChange={(e) =>
                setFormData({ ...formData, serverName: e.target.value })
              }
              placeholder="My Server"
              disabled={loading}
              className="w-full px-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
              required
            />
          </div>

          {/* Server IP */}
          <div>
            <label className="block text-sm font-medium mb-2">Server IP</label>
            <input
              type="text"
              value={formData.serverIp}
              onChange={(e) =>
                setFormData({ ...formData, serverIp: e.target.value })
              }
              placeholder="192.168.1.1"
              disabled={loading}
              className="w-full px-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
              required
            />
          </div>

          {/* Server Port */}
          <div>
            <label className="block text-sm font-medium mb-2">Server Port</label>
            <input
              type="number"
              value={formData.serverPort}
              onChange={(e) =>
                setFormData({ ...formData, serverPort: parseInt(e.target.value) })
              }
              placeholder="25565"
              disabled={loading}
              className="w-full px-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
              required
            />
          </div>

          {/* Version (Optional) */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Minecraft Version <span className="text-xs text-muted-foreground">(optional)</span>
            </label>
            <input
              type="text"
              value={formData.version}
              onChange={(e) =>
                setFormData({ ...formData, version: e.target.value })
              }
              placeholder="1.20.1 or leave empty for auto-detect"
              disabled={loading}
              className="w-full px-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Saving..." : bot ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
