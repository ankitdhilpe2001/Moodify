import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "../styles/mp3player.scss";
import { usePlaylist } from "../hook/usePlaylist";
import PlaylistDrawer from "./PlaylistDrawer";

const RepeatMode = {
  NONE: "none",
  ALL: "all",
  ONE: "one",
};

const getVolumeIcon = (isMuted, volume) => {
  if (isMuted || volume === 0)
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <line x1="23" y1="9" x2="17" y2="15" />
        <line x1="17" y1="9" x2="23" y2="15" />
      </svg>
    );

  if (volume < 0.4)
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      </svg>
    );

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
};

const MP3Player = ({ mood = "neutral" }) => {
  const audioRef = useRef(null);
  const shouldAutoPlayRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [repeatMode, setRepeatMode] = useState(RepeatMode.NONE);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackError, setPlaybackError] = useState("");
  const [showPlaylist, setShowPlaylist] = useState(false);
  // const { song, loading, handleGetSong } = useSong();     //useSong hook
  const {
    loading,
    playlist,
    currentSong,
    currentIndex,
    handleNext: nextTrack,
    handlePrev: prevTrack,
    handleGetSongPlaylist,
    handleSelect,
  } = usePlaylist();

  const currentTrack = useMemo(
    () =>
      currentSong?.url
        ? {
          src: currentSong.url,
          cover: currentSong.posterUrl,
          title: currentSong.title,
          artist: currentSong.artist || currentSong.singer,
          mood: currentSong.mood || mood,
        }
        : null,
    [mood, currentSong],
  );

  const resetAudioState = useCallback(() => {
    setProgress(0);
    setCurrentTime(0);
  }, []);

  useEffect(() => {
    handleGetSongPlaylist({ mood });
  }, [mood, handleGetSongPlaylist]);

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return "0:00";
    const minutes = Math.floor(secs / 60);
    const seconds = String(Math.floor(secs % 60)).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (!audio.paused) {
      audio.pause();
      return;
    }

    try {
      setPlaybackError("");
      await audio.play();
    } catch (error) {
      console.error(error);
      setIsPlaying(false);
      setPlaybackError("Could not play this track");
    }
  }, [currentTrack]);

  const restartSong = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    resetAudioState();
  }, [resetAudioState]);

  const handleNext = useCallback(() => {
    shouldAutoPlayRef.current = !audioRef.current?.paused;
    nextTrack();
    resetAudioState();
  }, [nextTrack, resetAudioState]);

  const handlePrev = useCallback(() => {
    if (!audioRef.current) return;

    if (currentTime > 3) {
      audioRef.current.currentTime = 0;
      resetAudioState();
      return;
    }

    shouldAutoPlayRef.current = !audioRef.current.paused;
    prevTrack();
    resetAudioState();
  }, [currentTime, resetAudioState, prevTrack]);

  const handleSelectTrack = useCallback(
    (index) => {
      shouldAutoPlayRef.current = true;
      handleSelect(index);
      setShowPlaylist(false);
      resetAudioState();
    },
    [handleSelect, resetAudioState],
  );

  const cycleRepeat = () => {
    setRepeatMode((prev) => {
      if (prev === RepeatMode.NONE) return RepeatMode.ALL;
      if (prev === RepeatMode.ALL) return RepeatMode.ONE;
      return RepeatMode.NONE;
    });
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTime(audio.currentTime);
    setProgress((audio.currentTime / audio.duration) * 100 || 0);
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    resetAudioState();
    setDuration(audio?.duration || 0);
    if (audio) audio.volume = isMuted ? 0 : volume;

    if (audio && shouldAutoPlayRef.current) {
      shouldAutoPlayRef.current = false;
      audio.play().catch((error) => {
        console.error(error);
        setIsPlaying(false);
        setPlaybackError("Could not play this track");
      });
    }
  };

  const handleEnded = () => {
    if (repeatMode === RepeatMode.ONE) {
      restartSong();
      audioRef.current?.play();
      return;
    }

    if (repeatMode === RepeatMode.ALL && playlist.length > 1) {
      shouldAutoPlayRef.current = true;
      if (currentIndex === playlist.length - 1) {
        handleSelect(0);
      } else {
        nextTrack();
      }
      resetAudioState();
      return;
    }

    if (repeatMode === RepeatMode.NONE) {
      setIsPlaying(false);
      resetAudioState();
      return;
    }
  };

  const handleProgressChange = (e) => {
    const value = parseFloat(e.target.value);
    const audio = audioRef.current;

    if (audio && duration) {
      audio.currentTime = (value / 100) * duration;
    }

    setProgress(value);
  };

  const handleVolumeChange = (e) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
    if (audioRef.current) audioRef.current.volume = value;
    setIsMuted(value === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const stepVolume = (delta) => {
    const next = Math.min(1, Math.max(0, volume + delta));
    setVolume(next);
    if (audioRef.current) audioRef.current.volume = next;
    setIsMuted(next === 0);
  };

  return (
    <div className="mp3-player">
      {currentTrack?.src && (
        <audio
          key={currentTrack.src}
          ref={audioRef}
          src={currentTrack.src}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onLoadStart={() => {
            setIsPlaying(false);
            setDuration(0);
            setPlaybackError("");
            resetAudioState();
          }}
          onEnded={handleEnded}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onError={() => {
            setIsPlaying(false);
            setPlaybackError("Could not load this track");
          }}
        />
      )}

      {currentTrack?.mood && (
        <div className="mp3-player__mood-badge">
          <span className="mp3-player__mood-dot" />
          {currentTrack.mood}
        </div>
      )}

      <div
        className={`mp3-player__artwork ${isPlaying ? "mp3-player__artwork--spinning" : ""}`}
      >
        {currentTrack?.cover ? (
          <img src={currentTrack.cover} alt={currentTrack.title} />
        ) : (
          <div className="mp3-player__artwork-placeholder">
            <span className="mp3-player__artwork-rings" />
            <span className="mp3-player__artwork-rings" />
            <span className="mp3-player__artwork-rings" />
            <span className="mp3-player__artwork-hole" />
          </div>
        )}
      </div>

      <div className="mp3-player__info">
        <h2 className="mp3-player__title">
          {loading
            ? "Finding a song..."
            : currentTrack?.title || "No track selected"}
        </h2>
        <p className="mp3-player__artist">
          {playbackError || currentTrack?.artist || "-"}
        </p>
      </div>

      <div className="mp3-player__progress-area">
        <div className="mp3-player__times">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <input
          type="range"
          className="mp3-player__progress-bar"
          min="0"
          max="100"
          step="0.1"
          value={progress}
          onChange={handleProgressChange}
          aria-label="Seek"
        />
      </div>

      <div className="mp3-player__controls">
        <button
          className="mp3-player__ctrl-btn"
          onClick={handlePrev}
          aria-label="Previous"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="19 20 9 12 19 4 19 20" />
            <line x1="5" y1="19" x2="5" y2="5" />
          </svg>
        </button>

        <button
          className="mp3-player__play-btn"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          )}
        </button>

        <button
          className="mp3-player__ctrl-btn"
          onClick={handleNext}
          aria-label="Next"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="5 4 15 12 5 20 5 4" />
            <line x1="19" y1="5" x2="19" y2="19" />
          </svg>
        </button>

        <button
          className={`mp3-player__ctrl-btn mp3-player__repeat-btn ${repeatMode !== RepeatMode.NONE ? "mp3-player__ctrl-btn--active" : ""}`}
          onClick={cycleRepeat}
          aria-label="Repeat"
          title={`Repeat: ${repeatMode}`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="17 1 21 5 17 9" />
            <path d="M3 11V9a4 4 0 0 1 4-4h14" />
            <polyline points="7 23 3 19 7 15" />
            <path d="M21 13v2a4 4 0 0 1-4 4H3" />
          </svg>
          {repeatMode === RepeatMode.ONE && (
            <span className="mp3-player__repeat-badge">1</span>
          )}
        </button>

        <button
          className="mp3-player__ctrl-btn"
          onClick={() => setShowPlaylist((p) => !p)}
          aria-label="Playlist"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <circle cx="3" cy="6" r="1" fill="currentColor" />
            <circle cx="3" cy="12" r="1" fill="currentColor" />
            <circle cx="3" cy="18" r="1" fill="currentColor" />
          </svg>
        </button>
      </div>

      <div className="mp3-player__volume">
        <button
          className="mp3-player__vol-step"
          onClick={() => stepVolume(-0.1)}
          aria-label="Volume down"
        >
          -
        </button>
        <button
          className="mp3-player__vol-icon"
          onClick={toggleMute}
          aria-label="Toggle mute"
        >
          {getVolumeIcon(isMuted, volume)}
        </button>
        <input
          type="range"
          className="mp3-player__volume-bar"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          aria-label="Volume"
        />
        <button
          className="mp3-player__vol-step"
          onClick={() => stepVolume(0.1)}
          aria-label="Volume up"
        >
          +
        </button>
      </div>

      <PlaylistDrawer
        isOpen={showPlaylist}
        onClose={() => setShowPlaylist(false)}
        playlist={playlist}
        currentIndex={currentIndex}
        mood={mood}
        onSelect={handleSelectTrack}
      />
    </div>
  );
};

export default MP3Player;
