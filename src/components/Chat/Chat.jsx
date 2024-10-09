import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../App';
import UserList from '../UserList/UserList';
import { db } from '../../config';
import { collection, addDoc, query, where, onSnapshot, orderBy } from 'firebase/firestore';

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
            (msg.from === user.email && msg.to === selectedUser.email) ||
            (msg.from === selectedUser.email && msg.to === user.email)
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
          to: selectedUser.email,
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
        <div className="bg-white shadow rounded-lg p-4">
          <div className="mb-4">
            {selectedUser ? `Chat with ${selectedUser.email}` : 'Select a user to start chatting'}
          </div>
          <div className="h-96 overflow-y-auto mb-4 space-y-2">
            {messages.map((msg) => (
              <div key={msg.id} className={`p-2 rounded ${msg.from === user?.email ? 'bg-blue-100 ml-auto' : 'bg-gray-100'}`}>
                <strong>{msg.from === user?.email ? 'You' : msg.from}:</strong> {msg.content}
              </div>
            ))}
          </div>
          <form onSubmit={sendMessage} className="flex">
            <input
              type="text"
              className="flex-grow border rounded-l p-2"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type a message..."
              disabled={!selectedUser}
            />
            <button 
              className="bg-blue-500 text-white px-4 py-2 rounded-r"
              type="submit" 
              disabled={!selectedUser}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;