import React from 'react';

const Sidebar = ({ currentView, setCurrentView }) => {
  return (
    <aside className="sidebar">
      <div className="logo" style={{ color: 'var(--am-text)', fontSize: '20px', fontWeight: 'bold', marginBottom: '24px' }}>
        <span style={{ color: 'var(--am-accent)' }}></span> Music
      </div>
      <nav>
        <ul>
          <li className={currentView === 'search' ? 'active' : ''} onClick={() => setCurrentView('search')}>
            <span className="icon" style={{ display: 'inline-flex', marginRight: '12px', fontSize: '13px', color: currentView === 'search' ? 'var(--am-accent)' : 'inherit' }}>
              <i className="bi bi-search"></i>
            </span>
            Search
          </li>
          <li className={currentView === 'home' ? 'active' : ''} onClick={() => setCurrentView('home')}>
            <span className="icon" style={{ display: 'inline-flex', marginRight: '12px', fontSize: '14px', color: currentView === 'home' ? 'var(--am-accent)' : 'inherit' }}>
              <i className={currentView === 'home' ? "bi bi-house-door-fill" : "bi bi-house-door"}></i>
            </span>
            Home
          </li>
          <li className={currentView === 'new' ? 'active' : ''} onClick={() => setCurrentView('new')}>
            <span className="icon" style={{ display: 'inline-flex', marginRight: '12px', fontSize: '14px', color: currentView === 'new' ? 'var(--am-accent)' : 'inherit' }}>
              <i className={currentView === 'new' ? "bi bi-grid-fill" : "bi bi-grid"}></i>
            </span>
            New
          </li>
          <li className={currentView === 'radio' ? 'active' : ''} onClick={() => setCurrentView('radio')}>
            <span className="icon" style={{ display: 'inline-flex', marginRight: '12px', fontSize: '14px', color: currentView === 'radio' ? 'var(--am-accent)' : 'inherit' }}>
              <i className="bi bi-broadcast"></i>
            </span>
            Radio
          </li>
          <li className={currentView === 'settings' ? 'active' : ''} onClick={() => setCurrentView('settings')}>
            <span className="icon" style={{ display: 'inline-flex', marginRight: '12px', fontSize: '14px', color: currentView === 'settings' ? 'var(--am-accent)' : 'inherit' }}>
              <i className="bi bi-gear-wide"></i>
            </span>
            Settings
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
