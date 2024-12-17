import React from 'react';
import { Background } from './components/Background';
import { Login } from './components/Login';
import { LoginModal } from './components/auth/LoginModal';
import { SignupModal } from './components/auth/SignupModal';
import { Dashboard } from './components/Dashboard';
import { Header } from './components/Header';
import { ChatButton } from './components/chat/ChatButton';
import { ChatModal } from './components/chat/ChatModal';
import { User } from './types';
import { ThemeProvider } from './context/ThemeContext';
import { AIProvider } from './context/AIContext';
import { AuthProvider } from './context/AuthContext';
import { LayoutProvider } from './context/LayoutContext';
import { VideoProvider } from './context/VideoContext';
import { UserProvider } from './context/UserContext';
import { DesignProvider } from './context/DesignContext';
import { ViewportProvider } from './context/ViewportContext';

function App() {
  const [user, setUser] = React.useState<User | null>(null);
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const [isLoginOpen, setIsLoginOpen] = React.useState(false);
  const [showSignupModal, setShowSignupModal] = React.useState(false);

  const handleLogin = (email: string) => {
    setUser({
      id: crypto.randomUUID(),
      email,
      widgets: [],
    });
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <AIProvider>
          <UserProvider>
            <DesignProvider>
              <ViewportProvider>
                <LayoutProvider>
                  <VideoProvider>
                    <div className="min-h-screen text-slate-800 dark:text-white font-body flex flex-col">
                      <Background showVideo={!user} />
                      {/* Fixed UI Elements */}
                      <Header
                        user={user}
                        onLogout={handleLogout}
                        onLoginClick={() => setIsLoginOpen(true)}
                      />
                      
                      {user && (
                        <ChatButton onClick={() => setIsChatOpen(true)} />
                      )}

                      {/* Main Content */}
                      {!user ? <Login onSignup={() => setShowSignupModal(true)} /> : (
                        <Dashboard />
                      )}
                      
                      {/* Modals */}
                      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
                      {isLoginOpen && (
                        <LoginModal
                          onClose={() => setIsLoginOpen(false)}
                          initialMode="signin"
                          onLogin={(email) => {
                            handleLogin(email);
                            setIsLoginOpen(false);
                          }}
                        />
                      )}

                      {showSignupModal && (
                        <SignupModal
                          isOpen={showSignupModal}
                          onClose={() => setShowSignupModal(false)}
                        />
                      )}
                    </div>
                  </VideoProvider>
                </LayoutProvider>
              </ViewportProvider>
            </DesignProvider>
          </UserProvider>
        </AIProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;