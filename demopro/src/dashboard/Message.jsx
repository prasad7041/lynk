import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Send } from 'lucide-react';

export const Message = () => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [status, setStatus] = useState('disconnected');
  const [unread, setUnread] = useState({});
  const [user, setUser] = useState(null);
  const userRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    let payload;
    try {
      payload = JSON.parse(atob(token.split('.')[1]));
      setUser({ id: payload.id, username: payload.username });
      userRef.current = { id: payload.id, username: payload.username };
    } catch (err) {
      console.error('Token decode error:', err);
      return navigate('/login');
    }

    const ws = new WebSocket(`ws://lynk-backend-bmv8.onrender.com?token=${token}`);
    setSocket(ws);

    ws.onopen = () => {
      console.log('WebSocket connected');
      setStatus('connected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'online_users') {
        setOnlineUsers(data.users);
      } else if (data.type === 'private') {
        const isOwn = data.from === userRef.current?.id;

        // If user is not in current chat, mark as unread
        if (!isOwn && currentChat !== data.from) {
          setUnread(prev => ({
            ...prev,
            [data.from]: (prev[data.from] || 0) + 1
          }));
        }

        setChatLog(prev => [...prev, {
          ...data,
          isOwn
        }]);
      } else if (data.type === 'error') {
        alert(data.message);
      }
    };

    ws.onclose = () => setStatus('disconnected');
    ws.onerror = () => setStatus('error');

    return () => ws.close();
  }, [navigate, currentChat]);

  // Remove the manual message addition in sendPrivateMessage
const sendPrivateMessage = () => {
  if (!message.trim() || !currentChat || !socket) return;

  socket.send(JSON.stringify({
    type: 'private',
    to: currentChat,
    message: message.trim()
  }));

  setMessage('');
  // Remove this part since the server will echo it back
  // setChatLog(prev => [
  //   ...prev,
  //   {
  //     from: userRef.current.id,
  //     to: currentChat,
  //     message: message.trim(),
  //     isOwn: true,
  //     timestamp: new Date().toISOString()
  //   }
  // ]);
};

  const loadChatHistory = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `https://lynk-backend-bmv8.onrender.com/user/chat-history/${userRef.current.id}/${userId}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setChatLog(data.messages.map(msg => ({
          ...msg,
          isOwn: msg.from === userRef.current.id
        })));
      }
    } catch (err) {
      console.error('Failed to load chat history:', err);
    }
  };

  const handleUserSelect = (userId) => {
    setCurrentChat(userId);
    setUnread(prev => ({ ...prev, [userId]: 0 }));
    loadChatHistory(userId);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="p-4 font-bold border-b border-gray-200">Online Users</div>
        <div className="overflow-y-auto h-[calc(100vh-56px)]">
          {onlineUsers.map(u => (
            <div
              key={u.id}
              onClick={() => handleUserSelect(u.id)}
              className={`p-3 cursor-pointer hover:bg-gray-100 relative ${
                currentChat === u.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center">
                <span className="inline-block w-2 h-2 rounded-full mr-2 bg-green-500"></span>
                {u.username}
                {unread[u.id] > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {unread[u.id]}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentChat ? (
          <>
            <div className="p-4 border-b border-gray-200 bg-white flex items-center">
              <span className="inline-block w-2 h-2 rounded-full mr-2 bg-green-500"></span>
              <span className="font-semibold">
                {onlineUsers.find(u => u.id === currentChat)?.username || 'User'}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {chatLog.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-3 p-3 rounded-lg max-w-xs ${
                    msg.isOwn
                      ? 'ml-auto bg-blue-100 text-blue-900'
                      : 'mr-auto bg-white text-gray-900 border border-gray-200'
                  }`}
                >
                  {!msg.isOwn && (
                    <div className="font-bold text-xs text-blue-600">{msg.fromUsername}</div>
                  )}
                  <div className="my-1">{msg.message}</div>
                  <div className="text-xs text-gray-500 text-right">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendPrivateMessage()}
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type a message..."
                />
                <button
                  onClick={sendPrivateMessage}
                  disabled={!message.trim()}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center p-6 max-w-md">
              <MessageCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">Select a user to chat with</h3>
              <p className="text-gray-500">Click an online user to start a conversation</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
