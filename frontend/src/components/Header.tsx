import React from 'react';
import { Search, Bell, User } from 'lucide-react';

interface HeaderProps {
  currentView: string;
}

const Header: React.FC<HeaderProps> = ({ currentView }) => {
  return (
    <header className="top-header">
      <div className="breadcrumbs">
        <span>CRM</span>
        <span className="separator">/</span>
        {currentView === 'dashboard' ? (
          <span className="current">Dashboard</span>
        ) : (
          <>
            <span>Interactions</span>
            <span className="separator">/</span>
            <span className="current">Log New</span>
          </>
        )}
      </div>

      <div className="header-actions">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search HCPs or topics..." />
        </div>
        <button className="icon-btn">
          <Bell size={20} />
        </button>
        <div className="user-profile">
          <div className="avatar">
            <User size={18} />
          </div>
          <span>Jane Doe</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
