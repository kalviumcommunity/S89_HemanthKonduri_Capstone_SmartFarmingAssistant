import React, { useState } from 'react';
import './AIChat.css';
import NavBar from '../components/NavBar';

const AIChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = { text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: input }),
      });

      const data = await res.json();
      const botMessage = {
        text: data.response || "Sorry, I couldn't understand.",
        sender: 'bot',
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { text: "Error talking to AI.", sender: 'bot' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="aichat-container">
      <NavBar />
      <h2>🌾 Ask your farming doubts to AI!</h2>

      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {isLoading && <div className="message bot">Thinking...</div>}
      </div>

      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your question here..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default AIChat;
