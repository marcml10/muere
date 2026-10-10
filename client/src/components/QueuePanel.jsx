import React from 'react';
import { useQueue } from '../playback/QueueContext';
import { usePlayback } from '../playback/playBack';

const QueuePanel = () => {
  const { queue, currentIndex, isQueueVisible, toggleQueue, addToQueue, setQueue, removeFromQueue } = useQueue();
  const { currentTrack } = usePlayback();

  if (!isQueueVisible) return null;

  const handleClear = () => {
    if (currentIndex >= 0) {
      // Keep only up to the current track
      setQueue(queue.slice(0, currentIndex + 1));
    } else {
      setQueue([]);
    }
  };

  return (
    <div className="queue-panel">
      <div className="queue-header">
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff', margin: 0 }}>Up Next</h2>
        <button onClick={handleClear} style={{ 
          background: 'none', border: 'none', color: '#ff3b30', fontSize: '15px', cursor: 'pointer', padding: 0 
        }}>
          Clear
        </button>
      </div>

      <div className="queue-list">
        {queue.map((track, index) => {
          if (index <= currentIndex) return null; // Only show upcoming tracks
          
          return (
            <div 
              key={`${track.id}-${index}`} 
              className="queue-item"
              onClick={() => addToQueue(queue, index)}
            >
              <div style={{ position: 'relative', display: 'flex' }} className="queue-item-art-wrapper">
                <img src={track.thumbnailUrl} alt={track.title} className="queue-item-art" />
                <button 
                  className="queue-item-remove"
                  onClick={(e) => {
                    e.stopPropagation(); // prevent playing the track
                    removeFromQueue(index);
                  }}
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    left: '-6px',
                    width: '16px',
                    height: '16px',
                    backgroundColor: '#fff',
                    color: '#000',
                    border: 'none',
                    borderRadius: '50%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    padding: 0,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
                  }}
                >
                  <i className="bi bi-dash" style={{ fontSize: '16px', lineHeight: 1 }}></i>
                </button>
              </div>
              <div className="queue-item-info">
                <div className="queue-item-title">{track.title}</div>
                <div className="queue-item-artist">{track.artist}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QueuePanel;
