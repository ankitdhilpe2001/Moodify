import { getSongPlaylist } from "../service/song.api";
import { SongContext } from "../song.context";
import { useCallback, useContext } from "react";

export const usePlaylist = () => {
  const context = useContext(SongContext);

  if (!context) {
    throw new Error("usePlaylist must be used with the context");
  }

  const {
    playlist,
    setPlaylist,
    currentIndex,
    setCurrentIndex,
    loading,
    setLoading,
  } = context;

  const handleGetSongPlaylist = useCallback(
    async function ({ mood }) {
      try {
        setLoading(true);
        const data = await getSongPlaylist({ mood });
        setPlaylist(data.songPlaylist || []);
        setCurrentIndex(0);
      } catch (error) {
        console.log(error);
        setPlaylist([]);
        setCurrentIndex(0);
      } finally {
        setLoading(false);
      }
    },
    [setCurrentIndex, setLoading, setPlaylist],
  );

  const currentSong = playlist[currentIndex] || null;

  const handleNext = useCallback(() => {
    setCurrentIndex((index) => Math.min(index + 1, playlist.length - 1));
  }, [playlist.length, setCurrentIndex]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((index) => Math.max(index - 1, 0));
  }, [setCurrentIndex]);

  const handleSelect = useCallback(
    (index) => {
      if (index < 0 || index >= playlist.length) return;
      setCurrentIndex(index);
    },
    [playlist.length, setCurrentIndex],
  );

  return {
    loading,
    playlist,
    currentIndex,
    handleGetSongPlaylist,
    currentSong,
    handleNext,
    handlePrev,
    handleSelect,
  };
};
