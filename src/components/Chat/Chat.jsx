import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../App';
import { db } from '../../config';
import { collection, addDoc, query, onSnapshot, orderBy } from 'firebase/firestore';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const { user } = useContext(AppContext);

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedMessages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (inputMessage.trim() && user) {
      try {
        await addDoc(collection(db, 'messages'), {
          content: inputMessage,
          from: user.email,
          timestamp: new Date()
        });
        setInputMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 flex flex-col h-[calc(100vh-2rem)]">
      <div className="mb-4 font-bold text-lg">
        Group Chat
      </div>
      <div className="flex-grow overflow-y-auto mb-4 space-y-2 p-4">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`p-2 rounded-lg max-w-[70%] ${
              msg.from === user?.email 
                ? 'bg-blue-500 text-white ml-auto' 
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            <div className="text-xs font-bold opacity-75 mb-1">{msg.from}</div>
            {msg.content}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="flex">
        <Input
          type="text"
          className="flex-grow"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <Button 
          type="submit" 
          disabled={!inputMessage.trim()}
          className="ml-2"
        >
          Send
        </Button>
      </form>
    </div>
  );
};

export default Chat;