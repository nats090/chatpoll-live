import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../App';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const { user } = useContext(AppContext);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3000'); // Replace with your WebSocket server URL

    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage && ws) {
      ws.send(JSON.stringify({ message: inputMessage, user: user?.email }));
      setInputMessage('');
    }
  };

  return (
    <div className="card">
      <div className="card-header">Chat</div>
      <div className="card-body">
        <ul className="list-group mb-3" style={{ height: '300px', overflowY: 'scroll' }}>
          {messages.map((msg, index) => (
            <li key={index} className="list-group-item">{msg}</li>
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
            />
            <button className="btn btn-primary" type="submit">Send</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;