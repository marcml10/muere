import { useState } from 'react';

const Sidebar = ({ currentView, setCurrentView }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('muer_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [showModal, setShowModal] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignIn = (e) => {
    e.preventDefault();
    const trimmed = emailInput.trim();
    if (!trimmed) {
      setErrorMsg('Please enter your Apple ID or email');
      return;
    }

    const displayName = trimmed.includes('@') ? trimmed.split('@')[0] : trimmed;
    const userData = {
      name: displayName,
      email: trimmed.includes('@') ? trimmed : `${trimmed}@icloud.com`
    };

    try {
      localStorage.setItem('muer_user', JSON.stringify(userData));
    } catch (err) {
      console.error('Failed to save user:', err);
    }

    setUser(userData);
    setShowModal(false);
    setEmailInput('');
    setPasswordInput('');
    setErrorMsg('');
  };

  const handleSignOut = () => {
    try {
      localStorage.removeItem('muer_user');
    } catch (err) {
      console.error('Failed to remove user:', err);
    }
    setUser(null);
  };

  return (
    <>
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
                  <i className={currentView === 'playlists' ? 'bi bi-folder-fill' : 'bi bi-folder'}></i>
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

        {/* Lower end of sidebar: Sign In / Account section */}
        <div className="sidebar-footer">
          {user ? (
            <div className="sidebar-user-card">
              <div className="sidebar-user-avatar" title={user.name}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="sidebar-user-info">
                <span className="sidebar-user-name" title={user.name}>{user.name}</span>
                <span className="sidebar-user-email" title={user.email}>{user.email}</span>
              </div>
              <button
                type="button"
                className="sidebar-signout-btn"
                onClick={handleSignOut}
                title="Sign Out"
                aria-label="Sign Out"
              >
                <i className="bi bi-box-arrow-right"></i>
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="sidebar-signin-btn"
              onClick={() => {
                setErrorMsg('');
                setShowModal(true);
              }}
            >
              <i className="bi bi-person-circle"></i>
              <span>Sign In</span>
            </button>
          )}
        </div>
      </aside>

      {/* Apple Music Style Auth Modal */}
      {showModal && (
        <div className="auth-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="auth-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="auth-modal-close"
              onClick={() => setShowModal(false)}
              aria-label="Close"
            >
              <i className="bi bi-x"></i>
            </button>

            <div className="auth-modal-header">
              <div className="auth-modal-logo">
                <span style={{ color: 'var(--am-accent)' }}></span> Music
              </div>
              <h2 className="auth-modal-title">Sign in with your Apple ID</h2>
              <p className="auth-modal-desc">
                Access your personal playlists, favorites, and music library across all devices.
              </p>
            </div>

            <form onSubmit={handleSignIn} className="auth-modal-form">
              {errorMsg && <div className="auth-modal-error">{errorMsg}</div>}
              <div className="auth-modal-field">
                <input
                  type="text"
                  className="auth-modal-input"
                  placeholder="Apple ID or Email"
                  value={emailInput}
                  onChange={(e) => {
                    setEmailInput(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  autoFocus
                />
              </div>
              <div className="auth-modal-field">
                <input
                  type="password"
                  className="auth-modal-input"
                  placeholder="Password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                />
              </div>

              <div className="auth-modal-actions">
                <button
                  type="button"
                  className="auth-modal-btn secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="auth-modal-btn primary">
                  Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
