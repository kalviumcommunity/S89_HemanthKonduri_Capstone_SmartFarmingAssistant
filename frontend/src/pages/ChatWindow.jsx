// frontend/src/pages/ChatWindow.jsx

import React, { useState, useEffect, useRef } from 'react';
import { sendMessageToBackend } from '../contexts/chatService';
import './ChatWindow.css';
import NavBar from '../components/NavBar';

// --- Polished SVG Icons (Corrected for Styling) ---
const NewChatIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>;
const ChatBubbleIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const DeleteIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>;
const UserIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;

// --- CORRECTED ICONS ---
// We use fill="currentColor" to make styling simple with the CSS 'color' property.
const SendIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z"/></svg>;
const FloatingChatIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16"><path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/></svg>;


// --- Avatar Components ---
const BotAvatar = () => <div className="bot-avatar">S</div>;
const UserAvatar = () => <div className="user-avatar"><UserIcon/></div>;

const ChatWindow = () => {
  // --- All your existing state and logic remains exactly the same ---
  // ... (Full block of your existing state and logic) ...
  const [theme, setTheme] = useState(() => localStorage.getItem('chatTheme') || 'light');
  useEffect(() => { document.body.setAttribute('data-chat-theme', theme); localStorage.setItem('chatTheme', theme); }, [theme]);
  const toggleTheme = () => setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  const createInitialBotMessage = () => ({ id: 'bot-initial-' + Date.now(), text: "👋 Hello! I'm Sapra, your 24x7 AI assistant. How can I help you today?", sender: 'bot', role: 'model', parts: [{ text: "👋 Hello! I'm Sapra, your 24x7 AI assistant. How can I help you today?" }] });
  const [allChats, setAllChats] = useState(() => { const savedChats = localStorage.getItem('chatSessions'); return savedChats ? JSON.parse(savedChats) : {}; });
  const [activeChatId, setActiveChatId] = useState(null);
  const [currentMessages, setCurrentMessages] = useState([createInitialBotMessage()]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [currentMessages, isLoading]);
  useEffect(() => { localStorage.setItem('chatSessions', JSON.stringify(allChats)); }, [allChats]);
  useEffect(() => { const chatIds = Object.keys(allChats); if (chatIds.length > 0) { const mostRecentChatId = chatIds.sort((a,b) => Number(b.split('-')[1]) - Number(a.split('-')[1]))[0]; if (mostRecentChatId) { loadChat(mostRecentChatId); } else { startNewNamedChat("New Conversation"); } } else { startNewNamedChat("New Conversation"); } /* eslint-disable-next-line */ }, []);
  useEffect(() => { if (textareaRef.current) { textareaRef.current.style.height = 'auto'; textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; } }, [inputText]);
  const handleInputChange = (e) => setInputText(e.target.value);
  const handleSendMessage = async (e) => { if (e) e.preventDefault(); const trimmedInput = inputText.trim(); if (!trimmedInput) return; const userMessage = { id: 'user-' + Date.now(), text: trimmedInput, sender: 'user', role: 'user', parts: [{ text: trimmedInput }] }; let updatedMessagesWithUser = [...currentMessages, userMessage]; if (currentMessages.length === 1 && currentMessages[0].id.startsWith('bot-initial')) { updatedMessagesWithUser = [userMessage]; } setCurrentMessages(updatedMessagesWithUser); setInputText(''); setIsLoading(true); setError(''); let currentChatId = activeChatId; if (!currentChatId || (allChats[currentChatId] && allChats[currentChatId].messages.length <= 1)) { const newName = trimmedInput.substring(0, 25).trim() + (trimmedInput.length > 25 ? '...' : ''); currentChatId = 'chat-' + Date.now(); setActiveChatId(currentChatId); setAllChats(prev => ({...prev, [currentChatId]: {name: newName, messages: updatedMessagesWithUser}})); } else { setAllChats(prev => ({...prev, [currentChatId]: {...prev[currentChatId], messages: updatedMessagesWithUser}})); } const historyForBackend = updatedMessagesWithUser.slice(0, -1).map(msg => ({role: msg.role, parts: [{text: msg.text}]})); try { const botReplyText = await sendMessageToBackend(trimmedInput, historyForBackend); const botMessage = {id: 'bot-' + Date.now(), text: botReplyText, sender: 'bot', role: 'model', parts: [{text: botReplyText}]}; const finalMessages = [...updatedMessagesWithUser, botMessage]; setCurrentMessages(finalMessages); setAllChats(prev => ({...prev, [currentChatId]: {...prev[currentChatId], messages: finalMessages}})); } catch (err) { console.error("Error sending message:", err); setError(err.message || 'Failed to get AI response.'); setCurrentMessages(prev => prev.filter(msg => msg.id !== userMessage.id)); setAllChats(prev => ({...prev, [currentChatId]: {...prev[currentChatId], messages: prev[currentChatId].messages.filter(msg => msg.id !== userMessage.id)}})); } finally { setIsLoading(false); if(textareaRef.current) textareaRef.current.focus(); } };
  const handleKeyPress = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); } };
  const startNewNamedChat = (name) => { const newChatId = 'chat-' + Date.now(); const initialMsg = createInitialBotMessage(); setAllChats(prev => ({...prev, [newChatId]: {name: name, messages: [initialMsg]}})); setActiveChatId(newChatId); setCurrentMessages([initialMsg]); setInputText(''); setError(''); };
  const handleNewChatClick = () => { startNewNamedChat("New Conversation"); };
  const loadChat = (chatId) => { if (allChats[chatId]) { setActiveChatId(chatId); setCurrentMessages(allChats[chatId].messages); setError(''); } };
  const handleDeleteChat = (e, chatIdToDelete) => { e.stopPropagation(); if (window.confirm(`Are you sure you want to delete this chat?`)) { setAllChats(prev => { const updatedChats = {...prev}; delete updatedChats[chatIdToDelete]; return updatedChats; }); if (activeChatId === chatIdToDelete) { const remainingChatIds = Object.keys(allChats).filter(id => id !== chatIdToDelete).sort((a,b) => Number(b.split('-')[1]) - Number(a.split('-')[1])); if (remainingChatIds.length > 0) { loadChat(remainingChatIds[0]); } else { startNewNamedChat("New Conversation"); } } } };
  const sortedChatIds = Object.keys(allChats).sort((a, b) => Number(b.split('-')[1]) - Number(a.split('-')[1]));
  // --- End of existing logic ---


  return (
    <div className="cw-page-container">
        {/* === The Floating Chat Button at the bottom right === */}
        <NavBar/>
        <div className="cw-floating-action-button" onClick={() => { /* In a real app, this would open a popup or navigate */ }}>
            <FloatingChatIcon />
        </div>
        
      <div className="cw-chat-layout">
        <aside className="cw-sidebar">
          <div className="cw-sidebar-header">
            <button className="cw-new-chat-btn" onClick={handleNewChatClick}><NewChatIcon /><span>New Chat</span></button>
          </div>
          <nav className="cw-history-list">
            {sortedChatIds.map((chatId) => (
              allChats[chatId] && (
                <div key={chatId} className={`cw-history-item ${chatId === activeChatId ? 'active' : ''}`} onClick={() => loadChat(chatId)}>
                  <ChatBubbleIcon />
                  <span className="cw-history-item-name">{allChats[chatId].name}</span>
                  <button className="cw-delete-chat-btn" onClick={(e) => handleDeleteChat(e, chatId)} title="Delete chat"><DeleteIcon /></button>
                </div>
              )
            ))}
          </nav>
          <div className="cw-sidebar-footer">
            <div className="cw-theme-toggle">
              <span>Dark Mode</span>
              <label className="cw-switch"><input type="checkbox" onChange={toggleTheme} checked={theme === 'dark'} /><span className="cw-slider"></span></label>
            </div>
          </div>
        </aside>

        <main className="cw-chat-main">
          {error && <div className="cw-error-display">{error}</div>}
          
          <div className="cw-messages-container">
            <div className="cw-messages">
                {currentMessages.map((msg, index) => (
                    <div key={msg.id || index} className={`cw-message-wrapper ${msg.sender}`}>
                        <div className="cw-message-content">
                            {msg.sender === 'bot' && <div className="bot-name">Sapra</div>}
                            <div className="cw-message-bubble">{msg.text.split('\n').map((line, i) => <p key={i}>{line}</p>)}</div>
                        </div>
                        {msg.sender === 'user' && <UserAvatar />}
                    </div>
                ))}
                {isLoading && (
                    <div className="cw-message-wrapper bot">
                        <div className="cw-message-content">
                            <div className="bot-name">Sapra</div>
                            <div className="cw-message-bubble cw-typing-indicator"><span></span><span></span><span></span></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="cw-input-area">
            <form className="cw-input-form" onSubmit={handleSendMessage}>
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                placeholder="Ask Sapra anything..."
                disabled={isLoading}
                rows="1"
              />
              <button type="submit" className="cw-send-btn" disabled={isLoading || !inputText.trim()} aria-label="Send message">
                <SendIcon />
              </button>
            </form>
            <p className="cw-footer-text">Sapra AI can make mistakes. Please verify important information.</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChatWindow;