import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Chat</h2>
      <div className="mb-4 h-64 overflow-y-auto border border-gray-200 rounded p-2">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">{msg}</div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="flex space-x-2">
        <Input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow"
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
};

export default Chat;