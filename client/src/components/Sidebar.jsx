const Sidebar = ({ currentView, setCurrentView }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-content">
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
            <li className={currentView === 'liked' ? 'active' : ''} onClick={() => setCurrentView('liked')}>
              <span className="icon" style={{ display: 'inline-flex', marginRight: '12px', fontSize: '14px', color: currentView === 'liked' ? 'var(--am-accent)' : 'inherit' }}>
                <i className={currentView === 'liked' ? "bi bi-heart-fill" : "bi bi-heart"}></i>
              </span>
              Liked
            </li>
            <li className={currentView === 'playlists' ? 'active' : ''} onClick={() => setCurrentView('playlists')}>
              <span className="icon" style={{ display: 'inline-flex', marginRight: '12px', fontSize: '14px', color: currentView === 'playlists' ? 'var(--am-accent)' : 'inherit' }}>
                <i className={currentView === 'playlists' ? "bi bi-folder-fill" : "bi bi-folder"}></i>
              </span>
              Playlists
            </li>
            <li className={currentView === 'settings' ? 'active' : ''} onClick={() => setCurrentView('settings')}>
              <span className="icon" style={{ display: 'inline-flex', marginRight: '12px', fontSize: '14px', color: currentView === 'settings' ? 'var(--am-accent)' : 'inherit' }}>
                <i className="bi bi-gear-wide"></i>
              </span>
              Settings
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
