import React, { useState } from "react";
import axios from "axios";

function ChatWidget() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const sendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = { text: input, fromUser: true };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const response = await axios.post("https://api.taggoai.com/v1/chat", {
        message: input,
      });
      const botMessage = { text: response.data.reply, fromUser: false };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setInput("");
  };

  return (
    <div
      style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 1000 }}
    >
      <button
        className="bg-red-900 text-white rounded-full w-12 h-12 border-none cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <img
          alt="Logo"
          className="h-15 pt-2 pb-2"
          src="images/Logo/Logo-1.png?v=1"
          width="70"
        />
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            bottom: "70px",
            right: "0",
            width: "300px",
            height: "400px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            background: "white",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            overflowY: "auto",
          }}
        >
          <div style={{ padding: "10px" }}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{ textAlign: msg.fromUser ? "right" : "left" }}
              >
                <strong>{msg.fromUser ? "You" : "Bot"}:</strong> {msg.text}
              </div>
            ))}
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message"
              style={{ width: "80%", marginRight: "10px" }}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatWidget;
