import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';
import Login from './components/Auth/Login';
import Chat from './components/Chat/Chat';
import Poll from './components/Poll/Poll';
import 'bootstrap/dist/css/bootstrap.min.css';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
      {user ? (
        <>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
              <a className="navbar-brand" href="#">Real-Time App</a>
              <button className="btn btn-outline-danger" onClick={() => auth.signOut()}>Logout</button>
            </div>
          </nav>
          <div className="container mt-4">
            <div className="row">
              <div className="col-md-6">
                <Chat />
              </div>
              <div className="col-md-6">
                <Poll />
              </div>
            </div>
          </div>
        </>
      ) : (
        <Login />
      )}
    </div>
  );
};

export default App;