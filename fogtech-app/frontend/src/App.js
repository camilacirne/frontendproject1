import React, { useState, useEffect } from 'react';
import './App.css';

import Toast from './components/Toast';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CadastroPage from './pages/CadastroPage';
import CarrinhoPage from './pages/CarrinhoPage';
import TrocaSenhaPage from './pages/TrocaSenhaPage';
import CadastroServicoPage from './pages/CadastroServicoPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.location.hash = page;
  };

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('fogtech_user', JSON.stringify(userData));
    setCurrentPage('home');
  };

  const handleRegister = (userData) => {
    setUser(userData);
    localStorage.setItem('fogtech_user', JSON.stringify(userData));
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('fogtech_user');
    setCurrentPage('home');
    showToast('Logout realizado com sucesso', 'success');
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const closeToast = () => {
    setToast({ show: false, message: '', type: 'success' });
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('fogtech_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const handleHashChange = () => {
      const hash = window.location.hash.substring(1) || 'home';
      setCurrentPage(hash);
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if ((currentPage === 'carrinho' || currentPage === 'cadastro-servico') && !user) {
      showToast('Faça login para acessar esta página', 'error');
      setTimeout(() => handleNavigate('login'), 2000);
    }
  }, [currentPage, user]);

  return (
    <div className="App">
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-up {
          animation: fadeUp 0.6s ease-out forwards;
        }
      `}</style>

      <Header user={user} onNavigate={handleNavigate} onLogout={handleLogout} />

      {currentPage === 'home' && <HomePage />}
      
      {currentPage === 'login' && (
        <LoginPage 
          onNavigate={handleNavigate}
          onLogin={handleLogin}
          showToast={showToast}
        />
      )}
      
      {currentPage === 'cadastro' && (
        <CadastroPage 
          onNavigate={handleNavigate}
          onRegister={handleRegister}
          showToast={showToast}
        />
      )}
      
      {currentPage === 'carrinho' && user && (
        <CarrinhoPage 
          user={user}
          onNavigate={handleNavigate}
          showToast={showToast}
        />
      )}
      
      {currentPage === 'trocasenha' && (
        <TrocaSenhaPage 
          onNavigate={handleNavigate}
          showToast={showToast}
        />
      )}
      
      {currentPage === 'cadastro-servico' && user && (
        <CadastroServicoPage 
          onNavigate={handleNavigate}
          showToast={showToast}
        />
      )}

      <Footer />

      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      )}
    </div>
  );
}

export default App;