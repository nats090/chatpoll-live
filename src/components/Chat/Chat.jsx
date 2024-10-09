import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../App';
import UserList from '../UserList/UserList';
import { db } from '../../config';
import { collection, addDoc, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const { user } = useContext(AppContext);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (user && selectedUser) {
      const q = query(
        collection(db, 'messages'),
        where('participants', 'array-contains', user.email),
        orderBy('timestamp', 'asc')
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const fetchedMessages = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(msg => 
            msg.participants.includes(user.email) && 
            msg.participants.includes(selectedUser.email)
          );
        setMessages(fetchedMessages);
      });

      return () => unsubscribe();
    }
  }, [user, selectedUser]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (inputMessage && user && selectedUser) {
      try {
        await addDoc(collection(db, 'messages'), {
          content: inputMessage,
          from: user.email,
          participants: [user.email, selectedUser.email],
          timestamp: new Date()
        });
        setInputMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleUserSelect = (selectedUser) => {
    setSelectedUser(selectedUser);
  };

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="col-span-1">
        <UserList onUserSelect={handleUserSelect} />
      </div>
      <div className="col-span-3">
        <div className="bg-white shadow rounded-lg p-4 flex flex-col h-[calc(100vh-2rem)]">
          <div className="mb-4 font-bold text-lg">
            {selectedUser ? `Chat with ${selectedUser.email}` : 'Select a user to start chatting'}
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
              disabled={!selectedUser}
            />
            <Button 
              type="submit" 
              disabled={!selectedUser || !inputMessage.trim()}
              className="ml-2"
            >
              Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;