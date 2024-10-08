import React, { useState, useEffect, createContext } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Chat from './components/Chat/Chat';
import Poll from './components/Poll/Poll';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// Create context for global state
export const AppContext = createContext<{
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}>({
  user: null,
  setUser: () => {},
});

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AppContext.Provider value={{ user, setUser }}>
      <Router>
        <div className="App">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
              <a className="navbar-brand" href="/">Real-Time App</a>
              {user ? (
                <button className="btn btn-outline-danger" onClick={() => auth.signOut()}>Logout</button>
              ) : (
                <div>
                  <a className="btn btn-outline-primary me-2" href="/login">Login</a>
                  <a className="btn btn-primary" href="/register">Register</a>
                </div>
              )}
            </div>
          </nav>
          <div className="container mt-4">
            <Routes>
              <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
              <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
              <Route path="/" element={
                user ? (
                  <div className="row">
                    <div className="col-md-6">
                      <Chat />
                    </div>
                    <div className="col-md-6">
                      <Poll />
                    </div>
                  </div>
                ) : (
                  <Navigate to="/login" />
                )
              } />
            </Routes>
          </div>
        </div>
      </Router>
    </AppContext.Provider>
  );
};

export default App;