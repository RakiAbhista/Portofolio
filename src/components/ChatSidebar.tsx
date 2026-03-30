"use client";

import { useEffect, useRef, useState } from "react";
import { X, Send } from "lucide-react";

interface ChatMessage {
  id: string;
  type: "incoming" | "outgoing";
  text: string;
  timestamp: Date;
}

interface ChatSidebarProps {
  botId: string;
  onClose: () => void;
}

export function ChatSidebar({ botId, onClose }: ChatSidebarProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "error" | "waiting">("connecting");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // WebSocket connection with dynamic domain detection
  useEffect(() => {
    console.log(`🔌 Attempting to connect to bot ${botId}...`);
    
    // Get domain from current window, works with both rakiabhista.my.id and www.rakiabhista.my.id
    const domain = typeof window !== 'undefined' ? window.location.hostname : 'rakiabhista.my.id';
    const wsUrl = `wss://${domain}/ws-api/?botId=${botId}`;
    
    console.log(`📡 Connecting to: ${wsUrl}`);
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log(`✅ WebSocket opened for bot ${botId}`);
      // Status message will be received from server
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Handle status messages from server
        if (data.type === "status") {
          console.log(`📊 Status: ${data.status} - ${data.message}`);
          if (data.status === "connected") {
            setIsConnected(true);
            setConnectionStatus("connected");
            setErrorMessage("");
          } else if (data.status === "waiting") {
            setIsConnected(false);
            setConnectionStatus("waiting");
            setErrorMessage("Bot is not online yet. Please start the bot.");
          } else if (data.status === "error") {
            setIsConnected(false);
            setConnectionStatus("error");
            setErrorMessage(data.message);
          }
          return;
        }

        // Handle chat messages
        if (data.type === "chat") {
          // Create unique ID combining timestamp + message content to avoid duplicates
          const uniqueId = `${data.timestamp}-${data.message.substring(0, 10)}`.replace(/[^a-zA-Z0-9-]/g, "");
          
          const message: ChatMessage = {
            id: uniqueId,
            type: data.isOwnMessage ? "outgoing" : "incoming",
            text: data.message,
            timestamp: new Date()
          };
          
          // Prevent duplicate messages
          setMessages((prev) => {
            const isDuplicate = prev.some((m) => m.id === message.id);
            return isDuplicate ? prev : [...prev, message];
          });
        }
      } catch (error) {
        // Handle non-JSON messages (raw text from bot)
        if (event.data && typeof event.data === "string") {
          const message: ChatMessage = {
            id: Date.now().toString(),
            type: "incoming",
            text: event.data,
            timestamp: new Date()
          };
          setMessages((prev) => [...prev, message]);
        }
      }
    };

    ws.onerror = (error) => {
      console.error(`❌ WebSocket error for bot ${botId}:`, error);
      setIsConnected(false);
      setConnectionStatus("error");
      setErrorMessage("Connection error. Check console for details.");
    };

    ws.onclose = () => {
      console.log(`🔌 WebSocket closed for bot ${botId}`);
      setIsConnected(false);
      setConnectionStatus("error");
    };

    wsRef.current = ws;

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [botId]);

  const handleSendMessage = () => {
    if (!input.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      return;
    }

    // Send JSON-formatted message to server
    wsRef.current.send(JSON.stringify({
      type: "send_chat",
      message: input
    }));
    
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <aside className="w-80 bg-card border-l border-border flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-border flex justify-between items-center">
        <div>
          <h3 className="font-bold">Chat</h3>
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${
                isConnected
                  ? "bg-green-500"
                  : connectionStatus === "waiting"
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
            />
            <p className="text-xs font-medium">
              {isConnected
                ? "Connected"
                : connectionStatus === "connecting"
                ? "Connecting..."
                : connectionStatus === "waiting"
                ? "Bot Offline"
                : "Error"}
            </p>
          </div>
          {errorMessage && <p className="text-xs text-red-500 mt-1">{errorMessage}</p>}
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-secondary rounded-lg transition"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p className="text-sm">No messages yet</p>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === "outgoing" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.type === "outgoing"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground"
                  }`}
                >
                  <p className="text-sm wrap-break-word">{msg.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {msg.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Send message..."
            disabled={!isConnected}
            className="flex-1 px-3 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          />
          <button
            onClick={handleSendMessage}
            disabled={!isConnected || !input.trim()}
            className="p-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
