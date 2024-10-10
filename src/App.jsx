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
import { Button } from "@/components/ui/button"

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
          <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-sm">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                  <div className="flex">
                    <Link to="/" className="flex-shrink-0 flex items-center">
                      Real-Time App
                    </Link>
                  </div>
                  <div className="flex items-center">
                    {user ? (
                      <>
                        {adminStatus && (
                          <>
                            <Link to="/dashboard" className="mr-4">
                              <Button variant="outline">Dashboard</Button>
                            </Link>
                            <Link to="/announcement" className="mr-4">
                              <Button variant="outline">Announcement</Button>
                            </Link>
                            <Link to="/poll-result" className="mr-4">
                              <Button variant="outline">Poll Results</Button>
                            </Link>
                          </>
                        )}
                        <Button variant="outline" onClick={() => auth.signOut()}>Logout</Button>
                      </>
                    ) : (
                      <>
                        <Link to="/login" className="mr-4">
                          <Button variant="outline">Login</Button>
                        </Link>
                        <Link to="/register">
                          <Button>Register</Button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              {user ? (
                <Routes>
                  <Route path="/" element={
                    <div className="flex">
                      <div className="w-1/4 mr-4">
                        <UserList />
                      </div>
                      <div className="w-3/4 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Chat />
                        <Poll />
                      </div>
                    </div>
                  } />
                  {adminStatus && (
                    <>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/announcement" element={<Announcement />} />
                      <Route path="/poll-result" element={<PollResult />} />
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
                      <h1 className="text-4xl font-bold mb-4">Welcome to Real-Time App</h1>
                      <p className="text-xl text-gray-600">Please login or register to continue.</p>
                    </div>
                  } />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              )}
            </main>
          </div>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </AppContext.Provider>
  );
};

export default App;