import React, { useState, useEffect, createContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, isAdmin } from './config';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Chat from './components/Chat/Chat';
import Poll from './components/Poll/Poll';
import UserList from './components/UserList/UserList';
import Dashboard from './components/Admin/Dashboard';
import Announcement from './components/Admin/Announcement';
import PollResult from './components/Admin/PollResult';
import UserAnnouncements from './components/User/UserAnnouncements';
import { Button } from "@/components/ui/button";
import { Facebook, Instagram } from 'lucide-react';

const queryClient = new QueryClient();

export const AppContext = createContext({
  user: null,
  setUser: () => {},
  isAdmin: false,
});

const App = () => {
  const [user, setUser] = useState(null);
  const [adminStatus, setAdminStatus] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAdminStatus(isAdmin(currentUser));
    });

    return () => unsubscribe();
  }, []);

  return (
    <AppContext.Provider value={{ user, setUser, isAdmin: adminStatus }}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <div className="flex flex-col min-h-screen bg-background text-foreground">
              <nav className="bg-secondary shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between h-16">
                    <div className="flex items-center">
                      <Link to="/" className="flex-shrink-0 flex items-center text-primary font-bold text-xl link-hover">
                        Real-Time App
                      </Link>
                    </div>
                    <div className="flex items-center">
                      {user ? (
                        <>
                          <Link to="/poll-result" className="mr-4">
                            <Button variant="outline" className="button-hover">Poll Results</Button>
                          </Link>
                          <Link to="/announcements" className="mr-4">
                            <Button variant="outline" className="button-hover">Announcements</Button>
                          </Link>
                          {adminStatus && (
                            <>
                              <Link to="/dashboard" className="mr-4">
                                <Button variant="outline" className="button-hover">Dashboard</Button>
                              </Link>
                              <Link to="/announcement" className="mr-4">
                                <Button variant="outline" className="button-hover">Create Announcement</Button>
                              </Link>
                            </>
                          )}
                          <Button variant="outline" className="button-hover" onClick={() => auth.signOut()}>Logout</Button>
                        </>
                      ) : (
                        <>
                          <Link to="/login" className="mr-4">
                            <Button variant="outline" className="button-hover">Login</Button>
                          </Link>
                          <Link to="/register">
                            <Button className="button-hover">Register</Button>
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </nav>

              <main className="flex-grow">
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 scrollable-content">
                  {user ? (
                    <Routes>
                      <Route path="/" element={
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="w-full md:w-1/4">
                            <UserList />
                          </div>
                          <div className="w-full md:w-3/4 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Chat />
                            <Poll />
                          </div>
                        </div>
                      } />
                      <Route path="/poll-result" element={<PollResult />} />
                      <Route path="/announcements" element={<UserAnnouncements />} />
                      {adminStatus && (
                        <>
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/announcement" element={<Announcement />} />
                        </>
                      )}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  ) : (
                    <Routes>
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/" element={
                        <div className="text-center">
                          <h1 className="text-4xl font-bold mb-4 text-primary">Welcome to Real-Time App</h1>
                          <p className="text-xl text-muted-foreground">Please login or register to continue.</p>
                        </div>
                      } />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  )}
                </div>
              </main>

              <footer className="footer">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center space-x-4">
                  <a href="https://www.facebook.com/nathaniel.guerra.77" target="_blank" rel="noopener noreferrer" className="link-hover">
                    <Facebook className="social-icon" />
                  </a>
                  <a href="https://www.instagram.com/ntnl_lg/" target="_blank" rel="noopener noreferrer" className="link-hover">
                    <Instagram className="social-icon" />
                  </a>
                </div>
              </footer>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </AppContext.Provider>
  );
};

export default App;