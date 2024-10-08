import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebase';
import Login from '../components/Auth/Login';
import Chat from '../components/Chat/Chat';
import Poll from '../components/Poll/Poll';

const Index = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {user ? (
        <div className="container mx-auto px-4 py-8">
          <nav className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Real-Time Chat & Poll App</h1>
            <button 
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              onClick={() => auth.signOut()}
            >
              Logout
            </button>
          </nav>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Chat />
            <Poll />
          </div>
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
};

export default Index;