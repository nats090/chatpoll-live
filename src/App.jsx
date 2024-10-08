import React, { useState, useEffect, createContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Chat from './components/Chat/Chat';
import Poll from './components/Poll/Poll';
import { Button } from "@/components/ui/button"

const queryClient = new QueryClient();

export const AppContext = createContext({
  user: null,
  setUser: () => {},
});

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AppContext.Provider value={{ user, setUser }}>
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
                      <Button variant="outline" onClick={() => auth.signOut()}>Logout</Button>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Chat />
                  <Poll />
                </div>
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