import { useLiked } from '../playback/LikedContext';
import { useQueue } from '../playback/QueueContext';

const formatDuration = (duration) => {
  const seconds = Number(duration);
  if (!Number.isFinite(seconds) || seconds <= 0) return '—';
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
};

const LikedSongsPage = () => {
  const { likedSongs, toggleLike, removeLikedSong } = useLiked();
  const { addToQueue } = useQueue();

  return (
    <main className="main-content">
      <header className="header">
        <h1>Liked Songs</h1>
      </header>

      <section aria-label="Liked songs">
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', margin: '12px 0 28px' }}>
          <div style={{ width: '112px', height: '112px', borderRadius: '8px', background: 'linear-gradient(145deg, #fa243c, #8a164d)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
            <i className="bi bi-heart-fill" style={{ color: '#fff', fontSize: '42px' }} />
          </div>
          <div>
            <div style={{ color: 'var(--am-text-secondary)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Playlist</div>
            <h2 style={{ color: '#fff', fontSize: '30px', margin: '6px 0' }}>Liked Songs</h2>
            <div style={{ color: 'var(--am-text-secondary)', fontSize: '14px' }}>{likedSongs.length} {likedSongs.length === 1 ? 'song' : 'songs'}</div>
          </div>
        </div>

        {likedSongs.length === 0 ? (
          <div style={{ color: 'var(--am-text-secondary)', padding: '28px 0', textAlign: 'center' }}>
            <i className="bi bi-heart" style={{ display: 'block', fontSize: '32px', marginBottom: '12px' }} />
            Songs you like will show up here. Tap the heart on any song to add it.
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '32px minmax(0, 1fr) auto', gap: '16px', padding: '0 12px 10px', color: 'var(--am-text-secondary)', fontSize: '12px', borderBottom: '1px solid var(--am-border)' }}>
              <span>#</span><span>Title</span><span style={{ textAlign: 'right' }}><i className="bi bi-clock" /></span>
            </div>
            {likedSongs.map((song, index) => (
              <div
                key={song.id}
                role="button"
                tabIndex={0}
                onClick={() => addToQueue(likedSongs, index)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    addToQueue(likedSongs, index);
                  }
                }}
                style={{ display: 'grid', gridTemplateColumns: '32px minmax(0, 1fr) auto', alignItems: 'center', gap: '16px', padding: '10px 12px', borderRadius: '6px', cursor: 'pointer' }}
                onMouseEnter={(event) => { event.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                onMouseLeave={(event) => { event.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{ color: 'var(--am-text-secondary)', fontSize: '14px' }}>{index + 1}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                  {song.thumbnailUrl ? (
                    <img src={song.thumbnailUrl} alt="" style={{ width: '72px', height: '40px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }} />
                  ) : (
                    <span style={{ width: '72px', height: '40px', borderRadius: '4px', display: 'grid', placeItems: 'center', background: '#292929', flexShrink: 0 }}><i className="bi bi-music-note" /></span>
                  )}
                  <span style={{ minWidth: 0 }}>
                    <span style={{ display: 'block', color: '#fff', fontWeight: 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{song.title || 'Unknown title'}</span>
                    <span style={{ display: 'block', color: 'var(--am-text-secondary)', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{song.artist || 'Unknown artist'}</span>
                  </span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '14px', color: 'var(--am-text-secondary)', fontSize: '13px' }}>
                  <button 
                    type="button" 
                    aria-label={`Liked ${song.title || 'song'}`} 
                    title="Liked" 
                    onClick={(event) => { 
                      event.stopPropagation(); 
                      toggleLike(song); 
                    }} 
                    style={{ 
                      background: 'none', 
                      border: 0, 
                      color: 'var(--am-accent)', 
                      cursor: 'pointer', 
                      fontSize: '16px', 
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'color 0.2s ease, transform 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <i className="bi bi-heart-fill" />
                  </button>

                  <button 
                    type="button" 
                    aria-label={`Remove ${song.title || 'song'} from liked songs`} 
                    title="Remove from liked songs" 
                    onClick={(event) => { 
                      event.stopPropagation(); 
                      if (removeLikedSong) {
                        removeLikedSong(song.id);
                      } else {
                        toggleLike(song);
                      }
                    }} 
                    style={{ 
                      background: 'none', 
                      border: 0, 
                      color: 'var(--am-text-secondary)', 
                      cursor: 'pointer', 
                      fontSize: '15px', 
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'color 0.2s ease, transform 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#ff3b30';
                      e.currentTarget.style.transform = 'scale(1.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--am-text-secondary)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <i className="bi bi-trash" />
                  </button>

                  <span style={{ minWidth: '36px', textAlign: 'right' }}>{formatDuration(song.duration)}</span>
                </span>
              </div>
            ))}
          </>
        )}
      </section>
    </main>
  );
};

export default LikedSongsPage;
