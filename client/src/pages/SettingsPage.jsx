import React from 'react';

const SettingsPage = () => {
  const cardStyle = {
    backgroundColor: '#1F1F1F',
    borderRadius: '8px',
    padding: '20px 24px',
    marginBottom: '24px'
  };

  const rowStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 0'
  };

  return (
    <main className="main-content">
      <div style={{ maxWidth: '800px' }}>
        <header className="header" style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#fff', margin: 0 }}>Settings</h1>
        </header>

        {/* About */}
        <section style={cardStyle}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="bi bi-info-circle" style={{ color: 'var(--am-accent)' }}></i>
            About
          </h2>

          <div style={rowStyle}>
            <div>
              <div style={{ color: '#fff', fontSize: '15px', fontWeight: '500' }}>Muer Music Web Player</div>
              <div style={{ color: 'var(--am-text-secondary)', fontSize: '13px', marginTop: '2px' }}>
                Version 1.0.0
              </div>
            </div>
            <div style={{ color: 'var(--am-accent)', fontSize: '14px', fontWeight: '500' }}>
              Up to date
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default SettingsPage;
