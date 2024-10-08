import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../App';
import UserList from '../UserList/UserList';
import { API_URL } from '../../config';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const { user } = useContext(AppContext);
  const [ws, setWs] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const socket = new WebSocket(`${API_URL.replace('http', 'ws')}`);

    socket.onopen = () => {
      console.log('WebSocket connected');
      if (user) {
        socket.send(JSON.stringify({ type: 'auth', user: user.email }));
      }
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'private_message') {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, [user]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (inputMessage && ws && selectedUser) {
      const messageData = {
        type: 'private_message',
        from: user.email,
        to: selectedUser.email,
        content: inputMessage,
        timestamp: new Date().toISOString(),
      };
      ws.send(JSON.stringify(messageData));
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setInputMessage('');
    }
  };

  const handleUserSelect = (selectedUser) => {
    setSelectedUser(selectedUser);
    fetchPreviousMessages(selectedUser.email);
  };

  const fetchPreviousMessages = async (otherUserEmail) => {
    try {
      const response = await fetch(`${API_URL}/messages?user1=${user.email}&user2=${otherUserEmail}`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching previous messages:', error);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      <UserList onUserSelect={handleUserSelect} />
      <div className="col-span-2">
        <div className="card">
          <div className="card-header">
            {selectedUser ? `Chat with ${selectedUser.email}` : 'Select a user to start chatting'}
          </div>
          <div className="card-body">
            <ul className="list-group mb-3" style={{ height: '300px', overflowY: 'scroll' }}>
              {messages.map((msg, index) => (
                <li key={index} className={`list-group-item ${msg.from === user?.email ? 'text-right' : ''}`}>
                  <strong>{msg.from === user?.email ? 'You' : msg.from}:</strong> {msg.content}
                </li>
              ))}
            </ul>
            <form onSubmit={sendMessage}>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type a message..."
                  disabled={!selectedUser}
                />
                <button className="btn btn-primary" type="submit" disabled={!selectedUser}>
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;