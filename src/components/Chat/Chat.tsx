import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Replace with your WebSocket server URL

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    socket.on('chat message', (msg: string) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off('chat message');
    };
  }, []);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage) {
      socket.emit('chat message', inputMessage);
      setInputMessage('');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Chat</h2>
      <div className="mb-3">
        <ul className="list-group">
          {messages.map((msg, index) => (
            <li key={index} className="list-group-item">{msg}</li>
          ))}
        </ul>
      </div>
      <form onSubmit={sendMessage}>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button className="btn btn-primary" type="submit">Send</button>
        </div>
      </form>
    </div>
  );
};

export default Chat;