import React, { useState, useEffect, useRef } from 'react';
import { sendMessageToBackend } from '../contexts/chatService'; // Ensure this path is correct
import './ChatWindow.css'; // Your existing and new CSS will be here
import NavBar from '../components/NavBar';


const ChatWindow = () => {
  const createInitialBotMessage = () => ({
    id: 'bot-initial-' + Date.now(),
    text: "👋 Hello! I'm Sapra, your 24x7 AI assistant. How can I help you today?",
    sender: 'bot',
    role: 'model',
    parts: [{ text: "👋 Hello! I'm Sapra, your 24x7 AI assistant. How can I help you today?" }]
  });

  // State for all chat sessions stored in localStorage
  const [allChats, setAllChats] = useState(() => {
    const savedChats = localStorage.getItem('chatSessions');
    return savedChats ? JSON.parse(savedChats) : {};
  });

  // State for the currently active chat ID
  const [activeChatId, setActiveChatId] = useState(null);

  // State for messages of the currently active chat
  const [currentMessages, setCurrentMessages] = useState([createInitialBotMessage()]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Scroll to bottom when currentMessages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  // Save allChats to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('chatSessions', JSON.stringify(allChats));
  }, [allChats]);

  // Load the most recent chat or a new one on initial component mount
  useEffect(() => {
    const chatIds = Object.keys(allChats);
    if (chatIds.length > 0) {
      // Optional: Load the last active chat ID if you store that preference
      // For now, load the most recently created chat (assuming keys are timestamps or similar)
      const mostRecentChatId = chatIds.sort().pop(); // Simple sort, might need better logic for true recency
      if (mostRecentChatId) {
        loadChat(mostRecentChatId);
      } else {
        startNewNamedChat("Chat - " + new Date().toLocaleTimeString());
      }
    } else {
      // No chats in history, start a new one
      startNewNamedChat("Chat - " + new Date().toLocaleTimeString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on mount


  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputText]);


  const handleInputChange = (e) => setInputText(e.target.value);

  const handleSendMessage = async (e) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    const trimmedInput = inputText.trim();
    if (!trimmedInput) return;

    const userMessage = {
      id: 'user-' + Date.now(),
      text: trimmedInput,
      sender: 'user',
      role: 'user',
      parts: [{ text: trimmedInput }]
    };

    // Optimistically update current messages
    const updatedMessagesWithUser = [...currentMessages, userMessage];
    setCurrentMessages(updatedMessagesWithUser);
    setInputText('');
    setIsLoading(true);
    setError('');

    // Ensure activeChatId exists, create if not (e.g., first message in a "new" untitled chat)
    let currentChatId = activeChatId;
    if (!currentChatId) {
      currentChatId = 'chat-' + Date.now();
      setActiveChatId(currentChatId);
      setAllChats(prev => ({
        ...prev,
        [currentChatId]: {
          name: `Chat - ${new Date(Number(currentChatId.split('-')[1])).toLocaleTimeString()}`,
          messages: updatedMessagesWithUser
        }
      }));
    } else {
      // Update existing active chat with the new user message immediately
      setAllChats(prev => ({
        ...prev,
        [currentChatId]: {
          ...prev[currentChatId],
          messages: updatedMessagesWithUser
        }
      }));
    }


    // Prepare history for backend (all messages in the current chat up to the user's new message)
    const historyForBackend = updatedMessagesWithUser
      .filter(msg => msg.role) // Ensure only messages with a role are sent
      .map(msg => ({
        role: msg.role,
        parts: msg.parts
      }));

    try {
      // The backend expects history *before* the current user message,
      // and the current user message separately.
      // So, we send `updatedMessagesWithUser.slice(0, -1)` as history (all but last user message)
      // and `trimmedInput` as the current message.
      const messagesForGeminiHistory = updatedMessagesWithUser.slice(0, -1).map(m => ({role: m.role, parts: m.parts}));
      const botReplyText = await sendMessageToBackend(trimmedInput, messagesForGeminiHistory);

      const botMessage = {
        id: 'bot-' + Date.now(),
        text: botReplyText,
        sender: 'bot',
        role: 'model',
        parts: [{ text: botReplyText }]
      };

      const finalMessages = [...updatedMessagesWithUser, botMessage];
      setCurrentMessages(finalMessages);

      // Update the active chat in allChats with the bot's reply
      setAllChats(prev => ({
        ...prev,
        [currentChatId]: {
          ...prev[currentChatId],
          messages: finalMessages
        }
      }));

    } catch (err) {
      console.error("Error sending message:", err);
      setError(err.message || 'Failed to get AI response. Please try again.');
    
      setCurrentMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
      setAllChats(prev => ({
        ...prev,
        [currentChatId]: {
          ...prev[currentChatId],
          messages: prev[currentChatId].messages.filter(msg => msg.id !== userMessage.id)
        }
      }));
    } finally {
      setIsLoading(false);
      if (textareaRef.current) textareaRef.current.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const startNewNamedChat = (name) => {
    const newChatId = 'chat-' + Date.now();
    const initialMsg = createInitialBotMessage();
    setAllChats(prev => ({
      ...prev,
      [newChatId]: {
        name: name,
        messages: [initialMsg]
      }
    }));
    setActiveChatId(newChatId);
    setCurrentMessages([initialMsg]);
    setInputText('');
    setError('');
  };

  const handleNewChatClick = () => {
    const chatName = prompt('Enter a name for this new chat:', `Chat - ${new Date().toLocaleTimeString()}`);
    if (chatName) { // Only proceed if user provides a name (or accepts default and clicks OK)
      startNewNamedChat(chatName);
    }
  };

  const loadChat = (chatId) => {
    if (allChats[chatId]) {
      setActiveChatId(chatId);
      setCurrentMessages(allChats[chatId].messages);
      setError('');
    }
  };

  const handleDeleteChat = (e, chatIdToDelete) => {
    e.stopPropagation(); // Prevent loadChat from firing if delete button is on the item
    if (window.confirm(`Are you sure you want to delete "${allChats[chatIdToDelete]?.name || 'this chat'}"?`)) {
      setAllChats(prev => {
        const updatedChats = { ...prev };
        delete updatedChats[chatIdToDelete];
        return updatedChats;
      });
      // If the deleted chat was active, load another or start new
      if (activeChatId === chatIdToDelete) {
        const remainingChatIds = Object.keys(allChats).filter(id => id !== chatIdToDelete);
        if (remainingChatIds.length > 0) {
          loadChat(remainingChatIds[0]); // Load the first remaining chat
        } else {
          startNewNamedChat("Chat - " + new Date().toLocaleTimeString()); // Start a new one if no chats left
        }
      }
    }
  };
  
  // Get sorted chat IDs for display (e.g., newest first if IDs are timestamps)
  const sortedChatIds = Object.keys(allChats).sort((a, b) => {
    const timeA = Number(a.split('-')[1] || 0);
    const timeB = Number(b.split('-')[1] || 0);
    return timeB - timeA; // Sort descending (newest first)
  });


  return (
    <div className="cw-page-container">
      <NavBar/>
    
      <div className="cw-chat-layout">
        <aside className="cw-sidebar">
          <button className="cw-new-chat-btn" onClick={handleNewChatClick}>
            + New Chat
          </button>
          <ul className="cw-history-list">
            {sortedChatIds.map((chatId) => (
              allChats[chatId] && ( // Ensure chat exists, might be deleted then re-rendered
                <li
                  key={chatId}
                  className={`cw-history-item ${chatId === activeChatId ? 'active' : ''}`}
                  onClick={() => loadChat(chatId)}
                  title={allChats[chatId].name}
                >
                  <span className="cw-history-item-name">{allChats[chatId].name}</span>
                  <button
                    className="cw-delete-chat-btn"
                    onClick={(e) => handleDeleteChat(e, chatId)}
                    title="Delete chat"
                  >
                     {/* Trash can icon */}
                  </button>
                </li>
              )
            ))}
            {sortedChatIds.length === 0 && <p className="cw-no-history">No chat history yet.</p>}
          </ul>
        </aside>

        <main className="cw-chat-main">
          <div className="cw-header">
             💬 Sapra AI Assistant {activeChatId && allChats[activeChatId] ? `- ${allChats[activeChatId].name}` : ''}
          </div>

          {error && <div className="cw-error-display">{error}</div>}

          <div className="cw-messages">
            {currentMessages.map((msg) => (
              <div key={msg.id} className={`cw-message-wrapper ${msg.sender}`}>
                <div className="cw-message-bubble">
                  {(msg.text || "").split('\n').map((line, index, arr) => (
                    <React.Fragment key={index}>
                      {line}
                      {index < arr.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
            {isLoading && currentMessages.length > 0 && currentMessages[currentMessages.length - 1]?.sender === 'user' && (
              <div className="cw-message-wrapper bot">
                <div className="cw-message-bubble cw-typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="cw-input-form" onSubmit={handleSendMessage}>
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type your message to Sapra..."
              disabled={isLoading}
              aria-label="Chat input"
              rows="1"
            />
            <button type="submit" disabled={isLoading || !inputText.trim()} aria-label="Send message">
              {isLoading ? (
                <span className="cw-spinner" role="status" aria-label="Loading"></span>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              )}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default ChatWindow;