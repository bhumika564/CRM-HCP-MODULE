import React from 'react';
import { LayoutDashboard, Users, MessageSquare, LineChart, Settings } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo-icon">C</div>
        <h2>CRM Pro</h2>
      </div>
      
      <nav className="sidebar-nav">
        <button className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`} onClick={() => onNavigate('dashboard')} style={{ background: currentView === 'dashboard' ? 'var(--primary)' : 'transparent', border: 'none', width: '100%', textAlign: 'left' }}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </button>
        <button className="nav-item" style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}>
          <Users size={20} />
          <span>HCP Directory</span>
        </button>
        <button className={`nav-item ${currentView === 'interactions' ? 'active' : ''}`} onClick={() => onNavigate('interactions')} style={{ background: currentView === 'interactions' ? 'var(--primary)' : 'transparent', border: 'none', width: '100%', textAlign: 'left' }}>
          <MessageSquare size={20} />
          <span>Interactions</span>
        </button>
        <button className="nav-item" style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}>
          <LineChart size={20} />
          <span>Analytics</span>
        </button>
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item" style={{ background: 'transparent', border: 'none', width: '100%', textAlign: 'left' }}>
          <Settings size={20} />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
