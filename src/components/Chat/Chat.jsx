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
        const fetchedMessages = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
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
    <div className="grid grid-cols-3 gap-4">
      <UserList onUserSelect={handleUserSelect} />
      <div className="col-span-2">
        <div className="card">
          <div className="card-header">
            {selectedUser ? `Chat with ${selectedUser.email}` : 'Select a user to start chatting'}
          </div>
          <div className="card-body">
            <ul className="list-group mb-3" style={{ height: '300px', overflowY: 'scroll' }}>
              {messages.map((msg) => (
                <li key={msg.id} className={`list-group-item ${msg.from === user?.email ? 'text-right' : ''}`}>
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