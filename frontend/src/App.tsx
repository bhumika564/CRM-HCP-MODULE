import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import InteractionForm from './components/InteractionForm';
import AIChat from './components/AIChat';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');

  return (
    <div className="crm-layout">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      <div className="main-wrapper">
        <Header currentView={currentView} />
        {currentView === 'dashboard' ? (
          <Dashboard onNavigate={setCurrentView} />
        ) : (
          <main className="app-container">
            <InteractionForm />
            <AIChat />
          </main>
        )}
      </div>
    </div>
  );
};

export default App;
