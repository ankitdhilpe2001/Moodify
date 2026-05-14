import React, { useEffect, useRef } from "react";
import "../styles/playlistdrawer.scss";

const moodEmoji = {
  happy: "\u2600\ufe0f",
  sad: "\ud83c\udf27\ufe0f",
  surprised: "\u26a1",
};

const PlaylistDrawer = ({
  isOpen,
  onClose,
  playlist = [],
  currentIndex = 0,
  mood = "",
  onSelect,
}) => {
  const drawerRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (isOpen && drawerRef.current && !drawerRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const emoji = moodEmoji[mood?.toLowerCase()] || "\ud83c\udfb5";
  const moodLabel = mood
    ? mood.charAt(0).toUpperCase() + mood.slice(1).toLowerCase()
    : "Current";

  return (
    <>
      <div
        className={`playlist-backdrop ${isOpen ? "playlist-backdrop--visible" : ""}`}
        aria-hidden="true"
      />

      <aside
        ref={drawerRef}
        className={`playlist-drawer ${isOpen ? "playlist-drawer--open" : ""}`}
        aria-label="Playlist drawer"
        role="complementary"
      >
        <div className="playlist-drawer__header">
          <div className="playlist-drawer__heading">
            <span className="playlist-drawer__emoji">{emoji}</span>
            <div>
              <p className="playlist-drawer__mood-label">{moodLabel} Playlist</p>
              <p className="playlist-drawer__count">
                {playlist.length} {playlist.length === 1 ? "song" : "songs"}
              </p>
            </div>
          </div>
          <button
            className="playlist-drawer__close"
            onClick={onClose}
            aria-label="Close playlist"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="playlist-drawer__divider" />

        <ul className="playlist-drawer__list" role="list">
          {playlist.length === 0 ? (
            <li className="playlist-drawer__empty">
              <span>No songs found for this mood</span>
            </li>
          ) : (
            playlist.map((song, index) => {
              const isActive = index === currentIndex;
              const title = song.title || "Unknown Title";
              const artist = song.artist || song.singer || "Unknown Artist";
              const cover = song.posterUrl || null;

              return (
                <li key={song._id || index}>
                  <button
                    className={`playlist-drawer__item ${isActive ? "playlist-drawer__item--active" : ""}`}
                    onClick={() => onSelect(index)}
                    aria-current={isActive ? "true" : undefined}
                    aria-label={`Play ${title} by ${artist}`}
                  >
                    <span className="playlist-drawer__index" aria-hidden="true">
                      {isActive ? (
                        <span className="playlist-drawer__bars">
                          <span />
                          <span />
                          <span />
                        </span>
                      ) : (
                        <span className="playlist-drawer__num">{index + 1}</span>
                      )}
                    </span>

                    <span className="playlist-drawer__cover">
                      {cover ? (
                        <img src={cover} alt={title} />
                      ) : (
                        <span className="playlist-drawer__cover-fallback">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          >
                            <circle cx="12" cy="12" r="9" />
                            <circle cx="12" cy="12" r="3" />
                            <line x1="12" y1="3" x2="12" y2="9" />
                          </svg>
                        </span>
                      )}
                    </span>

                    <span className="playlist-drawer__item-info">
                      <span className="playlist-drawer__item-title">{title}</span>
                      <span className="playlist-drawer__item-artist">{artist}</span>
                    </span>

                    <span className="playlist-drawer__play-hint" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </span>
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </aside>
    </>
  );
};

export default PlaylistDrawer;
