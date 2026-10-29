import { useState } from 'react';
import { useQueue } from '../playback/QueueContext';
import { useLiked } from '../playback/LikedContext';

const STORAGE_KEY = 'muer_playlist_folders';
const LIKED_FOLDER_ID = '__liked_songs__';

const formatDuration = (duration) => {
  const seconds = Number(duration);
  if (!Number.isFinite(seconds) || seconds <= 0) return '—';
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
};

const readFolders = () => {
  try {
    const folders = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(folders) ? folders : [];
  } catch {
    return [];
  }
};

const PlaylistsPage = () => {
  const [folders, setFolders] = useState(readFolders);
  const [isCreating, setIsCreating] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const { addToQueue } = useQueue();
  const { likedSongs, toggleLike, isLiked } = useLiked();

  const saveFolders = (nextFolders) => {
    setFolders(nextFolders);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextFolders));
    } catch (error) {
      console.error('Failed to save playlist folders:', error);
    }
  };

  const createFolder = (event) => {
    event.preventDefault();
    const name = folderName.trim();
    if (!name) return;

    saveFolders([{ id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, name, createdAt: new Date().toISOString(), songs: [] }, ...folders]);
    setFolderName('');
    setIsCreating(false);
  };

  const deleteFolder = (folderId) => {
    if (selectedFolderId === folderId) {
      setSelectedFolderId(null);
    }
    const updated = folders.filter((f) => f.id !== folderId);
    saveFolders(updated);
  };

  const likedFolder = {
    id: LIKED_FOLDER_ID,
    name: 'Liked Songs',
    isSpecial: true,
    songs: likedSongs || [],
  };

  const allFolders = [likedFolder, ...folders];

  return (
    <main className="main-content">
      <header className="header">
        <h1>Playlists</h1>
        <div className="profile-icon" />
      </header>

      <section aria-label="Playlist folders">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', margin: '18px 0 24px' }}>
          <div>
            <h2 style={{ color: '#fff', fontSize: '22px', margin: 0 }}>Your folders</h2>
            <p style={{ color: 'var(--am-text-secondary)', fontSize: '14px', margin: '6px 0 0' }}>Organize your playlists into folders.</p>
          </div>
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 16px', border: 0, borderRadius: '999px', background: 'var(--am-accent)', color: '#fff', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            <i className="bi bi-folder-plus" /> New Folder
          </button>
        </div>

        {isCreating && (
          <form onSubmit={createFolder} style={{ display: 'flex', alignItems: 'center', gap: '10px', maxWidth: '520px', marginBottom: '24px' }}>
            <input
              autoFocus
              aria-label="Folder name"
              placeholder="Folder name"
              value={folderName}
              onChange={(event) => setFolderName(event.target.value)}
              style={{ flex: 1, minWidth: 0, padding: '11px 14px', borderRadius: '6px', border: '1px solid var(--am-border)', background: '#1f1f1f', color: '#fff', outlineColor: 'var(--am-accent)' }}
            />
            <button type="submit" disabled={!folderName.trim()} style={{ padding: '10px 16px', border: 0, borderRadius: '6px', background: 'var(--am-accent)', color: '#fff', cursor: folderName.trim() ? 'pointer' : 'not-allowed', opacity: folderName.trim() ? 1 : 0.5 }}>Create</button>
            <button type="button" onClick={() => { setIsCreating(false); setFolderName(''); }} style={{ padding: '10px 12px', border: '1px solid var(--am-border)', borderRadius: '6px', background: 'transparent', color: '#fff', cursor: 'pointer' }}>Cancel</button>
          </form>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '16px' }}>
          {allFolders.map((folder) => {
            const isSelected = selectedFolderId === folder.id;
            const songCount = Array.isArray(folder.songs) ? folder.songs.length : 0;
            return (
              <div
                key={folder.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedFolderId(isSelected ? null : folder.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedFolderId(isSelected ? null : folder.id);
                  }
                }}
                style={{
                  minHeight: '124px',
                  padding: '16px',
                  border: isSelected ? '1px solid var(--am-accent)' : '1px solid transparent',
                  borderRadius: '8px',
                  background: '#1f1f1f',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  textAlign: 'left',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'border-color 0.2s ease, background 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  {folder.isSpecial ? (
                    <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'linear-gradient(135deg, #fa243c, #8a164d)', display: 'grid', placeItems: 'center' }}>
                      <i className="bi bi-heart-fill" style={{ color: '#fff', fontSize: '18px' }} />
                    </div>
                  ) : (
                    <i className="bi bi-folder-fill" style={{ color: 'var(--am-accent)', fontSize: '28px' }} />
                  )}

                  {!folder.isSpecial && (
                    <button
                      type="button"
                      aria-label={`Delete ${folder.name}`}
                      title="Delete folder"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFolder(folder.id);
                      }}
                      style={{
                        background: 'none',
                        border: 0,
                        color: 'var(--am-text-secondary)',
                        cursor: 'pointer',
                        fontSize: '14px',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        opacity: 0.7,
                        transition: 'opacity 0.2s, color 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '1';
                        e.currentTarget.style.color = '#ff3b30';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '0.7';
                        e.currentTarget.style.color = 'var(--am-text-secondary)';
                      }}
                    >
                      <i className="bi bi-trash" />
                    </button>
                  )}
                </div>

                <div>
                  <span style={{ display: 'block', color: '#fff', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={folder.name}>
                    {folder.name}
                  </span>
                  <span style={{ color: 'var(--am-text-secondary)', fontSize: '12px' }}>
                    {songCount} {songCount === 1 ? 'song' : 'songs'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {selectedFolderId && (() => {
          const folder = allFolders.find((entry) => entry.id === selectedFolderId);
          if (!folder) return null;
          const songs = Array.isArray(folder.songs) ? folder.songs : [];

          return (
            <section aria-label={`${folder.name} songs`} style={{ marginTop: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {folder.isSpecial ? (
                    <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: 'linear-gradient(135deg, #fa243c, #8a164d)', display: 'grid', placeItems: 'center' }}>
                      <i className="bi bi-heart-fill" style={{ color: '#fff', fontSize: '18px' }} />
                    </div>
                  ) : (
                    <i className="bi bi-folder-fill" style={{ color: 'var(--am-accent)', fontSize: '26px' }} />
                  )}
                  <div>
                    <h2 style={{ color: '#fff', fontSize: '20px', margin: 0 }}>{folder.name}</h2>
                    <span style={{ color: 'var(--am-text-secondary)', fontSize: '13px' }}>
                      {songs.length} {songs.length === 1 ? 'song' : 'songs'}
                    </span>
                  </div>
                </div>

                {songs.length > 0 && (
                  <button
                    type="button"
                    onClick={() => addToQueue(songs, 0)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 18px',
                      borderRadius: '999px',
                      border: 0,
                      background: 'var(--am-accent)',
                      color: '#fff',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <i className="bi bi-play-fill" style={{ fontSize: '18px' }} /> Play All
                  </button>
                )}
              </div>

              {songs.length ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {songs.map((song, index) => (
                    <div
                      key={song.id || index}
                      role="button"
                      tabIndex={0}
                      onClick={() => addToQueue(songs, index)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          addToQueue(songs, index);
                        }
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 12px',
                        borderRadius: '6px',
                        background: 'transparent',
                        color: '#fff',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <span style={{ color: 'var(--am-text-secondary)', fontSize: '13px', width: '24px', textAlign: 'center', flexShrink: 0 }}>
                        {index + 1}
                      </span>
                      {song.thumbnailUrl ? (
                        <img src={song.thumbnailUrl} alt="" style={{ width: '64px', height: '38px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }} />
                      ) : (
                        <span style={{ width: '64px', height: '38px', borderRadius: '4px', display: 'grid', placeItems: 'center', background: '#292929', flexShrink: 0 }}>
                          <i className="bi bi-music-note" />
                        </span>
                      )}
                      <span style={{ minWidth: 0, flex: 1 }}>
                        <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 400 }}>
                          {song.title || 'Unknown title'}
                        </span>
                        <span style={{ display: 'block', color: 'var(--am-text-secondary)', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {song.artist || 'Unknown artist'}
                        </span>
                      </span>

                      {/* Like / Unlike button */}
                      <button
                        type="button"
                        aria-label={isLiked(song.id) ? `Unlike ${song.title || 'song'}` : `Like ${song.title || 'song'}`}
                        title={isLiked(song.id) ? "Unlike" : "Like"}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(song);
                        }}
                        style={{
                          background: 'none',
                          border: 0,
                          color: isLiked(song.id) ? 'var(--am-accent)' : 'var(--am-text-secondary)',
                          cursor: 'pointer',
                          fontSize: '16px',
                          padding: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          transition: 'transform 0.15s ease'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.15)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                      >
                        <i className={isLiked(song.id) ? "bi bi-heart-fill" : "bi bi-heart"} />
                      </button>

                      {/* Duration */}
                      <span style={{ color: 'var(--am-text-secondary)', fontSize: '12px', minWidth: '40px', textAlign: 'right', flexShrink: 0 }}>
                        {formatDuration(song.duration)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--am-text-secondary)' }}>
                  {folder.isSpecial
                    ? 'No liked songs yet. Like songs anywhere in the app to see them here.'
                    : 'This folder is empty. Add songs from the search menu.'}
                </p>
              )}
            </section>
          );
        })()}
      </section>
    </main>
  );
};

export default PlaylistsPage;
