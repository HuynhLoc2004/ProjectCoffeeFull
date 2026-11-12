import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import axiosClient from "../../AxiosClient";
import fallbackProductsData from "../../fallbackProducts.json";
import "./ChatAI.css";

const DEFAULT_MESSAGES = [
  {
    id: 1,
    text: "Xin chào! Tôi là trợ lý AI của cửa hàng The Coffee Chill. Tôi có thể giúp gì cho bạn hôm nay?",
    sender: "ai",
  },
];

const STORE_INFO = {
  name: "The Coffee Chill",
  owner: "Huỳnh Tấn Lộc",
  phone: "0977 958 350",
  address: "08 Nguyễn Thị Nhu, Tân Thạnh Đông, Củ Chi, TP. Hồ Chí Minh",
  hours: "07:00 - 22:00, Thứ 2 đến Chủ Nhật",
};

// Trả lời tức thì câu chào hỏi thông dụng để khách không phải chờ
const getQuickGreeting = (text) => {
  const normalized = text.trim().toLowerCase();
  const greetings = [
    "chào",
    "chào bạn",
    "chao",
    "chao ban",
    "xin chào",
    "xin chao",
    "hi",
    "hello",
    "hey",
    "alo",
    "quán ơi",
    "quan oi",
    "ê",
    "e",
  ];
  if (greetings.includes(normalized)) {
    return "Dạ em chào anh/chị ạ! Em là trợ lý ảo The Coffee Chill ☕. Em có thể giúp mình xem thực đơn, giá các món, địa chỉ quán hoặc hỗ trợ đặt hàng ạ!";
  }
  return null;
};

// Cung cấp thông tin dự phòng nhanh nếu máy chủ backend đang ngủ hoặc mất mạng
const getLocalSmartResponse = (query) => {
  const q = query.toLowerCase();
  const products = fallbackProductsData?.result || [];

  if (q.includes("địa chỉ") || q.includes("ở đâu") || q.includes("dia chi") || q.includes("o dau")) {
    return `Dạ quán The Coffee Chill tọa lạc tại: ${STORE_INFO.address}. Quán mở cửa từ ${STORE_INFO.hours} ạ! ☕`;
  }
  if (q.includes("số điện thoại") || q.includes("hotline") || q.includes("sđt") || q.includes("sdt") || q.includes("liên hệ")) {
    return `Dạ số hotline của quán là ${STORE_INFO.phone}. Bạn có thể gọi bất kỳ lúc nào để được hỗ trợ nhanh nhất ạ!`;
  }
  if (q.includes("chủ quán") || q.includes("chu quan") || q.includes("admin")) {
    return `Dạ quán The Coffee Chill được phát triển và quản lý bởi Admin ${STORE_INFO.owner} ạ!`;
  }
  if (q.includes("món bán chạy") || q.includes("hot") || q.includes("bestseller") || q.includes("ngon nhất")) {
    return "Dạ các món bán chạy nhất tại quán gồm có: Cà phê muối (32.000đ), Bạc xỉu đá (22.000đ), Trà sữa truyền thống (28.000đ) và Bánh croissant (25.000đ). Bạn thích vị cà phê đậm đà hay trà sữa ngọt ngào ạ?";
  }
  if (q.includes("menu") || q.includes("thực đơn") || q.includes("có những món gì") || q.includes("món gì")) {
    return `Dạ quán có đầy đủ 4 nhóm món chính: Cà phê nguyên bản, Americano tinh tế, Trà sữa thơm béo và các loại Bánh ngọt nướng tươi mỗi ngày. Mời bạn ghé mục "Sản phẩm" trên thanh điều hướng để xem trọn vẹn 29 món của quán nhé!`;
  }

  // Tra cứu giá theo tên món trong danh sách 29 món
  const matchedProduct = products.find((p) => q.includes(p.name.toLowerCase()));
  if (matchedProduct) {
    const priceText = matchedProduct.sale != null
      ? `${matchedProduct.sale.toLocaleString("vi-VN")}đ (đang giảm giá từ ${matchedProduct.price.toLocaleString("vi-VN")}đ)`
      : `${matchedProduct.price.toLocaleString("vi-VN")}đ`;
    return `Dạ món "${matchedProduct.name}" hiện có giá là ${priceText} ạ. Bạn có muốn đặt món này không ạ?`;
  }

  return "Dạ hiện tại hệ thống AI đang cập nhật dữ liệu. Bạn có thể xem thực đơn trực tiếp tại trang Sản phẩm hoặc liên hệ hotline 0977 958 350 để được tư vấn nhanh nhất ạ! ☕";
};

const ChatAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingSeconds, setLoadingSeconds] = useState(0);

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

  // Bộ đếm thời gian khi AI đang phản hồi để hiển thị thông báo tiến độ thân thiện
  useEffect(() => {
    let interval = null;
    if (isLoading) {
      setLoadingSeconds(0);
      interval = setInterval(() => {
        setLoadingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setLoadingSeconds(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading]);

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

  const handleSend = async (customText) => {
    const textToSend = typeof customText === "string" ? customText : input;
    if (!textToSend || textToSend.trim() === "" || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: textToSend.trim(),
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = textToSend.trim();
    setInput("");

    // 1. Nếu là câu chào thông thường -> Phản hồi tức thì 0ms
    const quickReply = getQuickGreeting(currentInput);
    if (quickReply) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            text: quickReply,
            sender: "ai",
          },
        ]);
      }, 300);
      return;
    }

    // 2. Gửi request tới backend AI
    setIsLoading(true);
    try {
      const response = await axiosClient.post(
        "/ai/chat",
        { content: currentInput },
        { timeout: 90000 }
      );

      let aiText = "";
      if (typeof response.data === "string") {
        aiText = response.data;
      } else if (response.data && typeof response.data === "object") {
        aiText = response.data.content || response.data.message || response.data.result || JSON.stringify(response.data);
      } else {
        aiText = "The Coffee Chill rất vui được hỗ trợ bạn!";
      }

      const aiResponse = {
        id: Date.now() + 1,
        text: aiText,
        sender: "ai",
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.warn("AI Chat Backend Error, using fallback:", error);
      // Sử dụng kiến thức quán dự phòng để luôn có câu trả lời chính xác
      const fallbackReply = getLocalSmartResponse(currentInput);
      const errorMessage = {
        id: Date.now() + 1,
        text: fallbackReply,
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

  const quickPrompts = [
    "Menu có những món gì?",
    "Quán ở đâu?",
    "Món bán chạy nhất?",
    "Hotline liên hệ",
  ];

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
              <div className="confirm-box">
                <p>Bạn có muốn xóa cuộc trò chuyện và đóng cửa sổ chat?</p>
                <div className="confirm-buttons">
                  <button className="confirm-btn yes" onClick={confirmClose}>
                    Đồng ý
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
              <div>
                <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "bold" }}>AI Assistant</h3>
                <span style={{ fontSize: "11px", color: "#10b981" }}>● Sẵn sàng phục vụ</span>
              </div>
            </div>
            <button className="close-btn" onClick={toggleChat} title="Đóng cửa sổ">
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
                  whiteSpace: "pre-wrap",
                  lineHeight: "1.5",
                  fontSize: "13.5px",
                }}
              >
                {typeof msg.text === "string" ? msg.text : JSON.stringify(msg.text)}
              </div>
            ))}

            {isLoading && (
              <div
                className="message ai"
                style={{
                  backgroundColor: "#1e293b",
                  border: "1px dashed #475569",
                  color: "#93c5fd",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  fontSize: "12.5px",
                  padding: "10px 14px",
                  borderRadius: "12px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "600" }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}>
                    <RefreshCw size={14} className="text-blue-400" />
                  </motion.div>
                  <span>
                    {loadingSeconds < 5
                      ? "AI đang soạn câu trả lời..."
                      : loadingSeconds < 15
                      ? "Đang liên hệ trợ lý AI của quán..."
                      : "Máy chủ đang thức dậy sau thời gian nghỉ (30-40s), xin đợi giây lát nhé ☕..."}
                  </span>
                </div>
                {loadingSeconds >= 10 && (
                  <span style={{ fontSize: "11px", color: "#cbd5e1", fontStyle: "italic" }}>
                    (Server Render gói miễn phí tự động nghỉ khi không có truy cập)
                  </span>
                )}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Chips */}
          <div
            style={{
              padding: "6px 10px",
              backgroundColor: "#0f172a",
              display: "flex",
              gap: "6px",
              overflowX: "auto",
              whiteSpace: "nowrap",
              borderTop: "1px solid #1e293b",
              scrollbarWidth: "none",
            }}
          >
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                disabled={isLoading}
                style={{
                  padding: "4px 10px",
                  fontSize: "11px",
                  backgroundColor: "#1e293b",
                  color: "#cbd5e1",
                  border: "1px solid #334155",
                  borderRadius: "14px",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                  flexShrink: 0,
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#2563eb";
                  e.currentTarget.style.color = "white";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "#1e293b";
                  e.currentTarget.style.color = "#cbd5e1";
                }}
              >
                {prompt}
              </button>
            ))}
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
              placeholder={isLoading ? "Đang xử lý..." : "Nhập câu hỏi của bạn..."}
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
              onClick={() => handleSend()}
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
        title="Trò chuyện với AI"
      >
        {isOpen ? <X size={30} /> : <MessageCircle size={30} />}
      </button>
    </div>
  );
};

export default ChatAI;
