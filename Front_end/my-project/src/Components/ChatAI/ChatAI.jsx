import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { motion } from "framer-motion";
import axiosClient from "../../AxiosClient";
import "./ChatAI.css";

const DEFAULT_MESSAGES = [
  {
    id: 1,
    text: "Xin chào! Tôi là trợ lý AI của cửa hàng. Tôi có thể giúp gì cho bạn hôm nay?",
    sender: "ai",
  },
];

const ChatAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem("chatAI");
      return saved ? JSON.parse(saved) : DEFAULT_MESSAGES;
    } catch (error) {
      console.error("Lỗi đọc localStorage:", error);
      return DEFAULT_MESSAGES;
    }
  });

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    localStorage.setItem("chatAI", JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => {
    if (isOpen) {
      setShowConfirm(true);
    } else {
      setIsOpen(true);
    }
  };

  const confirmClose = () => {
    setIsOpen(false);
    setShowConfirm(false);
    setMessages(DEFAULT_MESSAGES);
    setInput("");
    localStorage.removeItem("chatAI");
  };

  const cancelClose = () => {
    setShowConfirm(false);
  };

  const handleSend = async () => {
    if (input.trim() === "" || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      const response = await axiosClient.post("/ai/chat", {
        content: currentInput,
      });

      const aiResponse = {
        id: Date.now() + 1,
        text: response.data,
        sender: "ai",
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("AI Chat Error:", error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "Đã có lỗi xảy ra khi kết nối với AI. Vui lòng thử lại sau!",
        sender: "ai",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="chat-ai-container">
      {isOpen && (
        <div
          className="chat-window"
          style={{ backgroundColor: "#1e293b", color: "white" }}
        >
          {showConfirm && (
            <div
              className="confirm-overlay"
              style={{ background: "rgba(0,0,0,0.8)" }}
            >
              <div
                className="confirm-box"
                style={{ backgroundColor: "#334155", color: "white" }}
              >
                <p>Bạn có chắc muốn kết thúc cuộc trò chuyện này không?</p>
                <div className="confirm-buttons">
                  <button className="confirm-btn yes" onClick={confirmClose}>
                    Đóng
                  </button>
                  <button className="confirm-btn no" onClick={cancelClose}>
                    Tiếp tục
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="chat-header" style={{ backgroundColor: "#0f172a" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Bot size={20} className="text-blue-400" />
              <h3>AI Assistant</h3>
            </div>
            <button className="close-btn" onClick={toggleChat}>
              <X size={20} />
            </button>
          </div>

          <div className="chat-messages" style={{ backgroundColor: "#111827" }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`message ${msg.sender}`}
                style={{
                  backgroundColor: msg.sender === "ai" ? "#374151" : "#2563eb",
                  color: "white",
                }}
              >
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div
                className="message ai"
                style={{
                  fontStyle: "italic",
                  backgroundColor: "transparent",
                  color: "#60a5fa",
                  display: "flex",
                  alignItems: "center",
                  gap: "2px",
                  fontWeight: "600"
                }}
              >
                AI đang phản hồi
                <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}>.</motion.span>
                <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}>.</motion.span>
                <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.6 }}>.</motion.span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div
            className="chat-input-area"
            style={{
              backgroundColor: "#1e293b",
              borderTop: "1px solid #334155",
            }}
          >
            <input
              type="text"
              placeholder={isLoading ? "Đang xử lý..." : "Nhập tin nhắn..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              style={{
                backgroundColor: "#0f172a",
                border: "1px solid #334155",
                color: "white",
              }}
            />
            <button
              className="send-btn"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      <button
        className="chat-button"
        onClick={toggleChat}
        style={{ backgroundColor: "#2563eb" }}
      >
        {isOpen ? <X size={30} /> : <MessageCircle size={30} />}
      </button>
    </div>
  );
};

export default ChatAI;
