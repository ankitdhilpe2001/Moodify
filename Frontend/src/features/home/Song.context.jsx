import { SongContext } from "./song.context";
import { useState } from "react";

export const SongProvider = ({ children }) => {
  const [song, setSong] = useState({
    url: "",
    posterUrl: "",
    title: "",
    mood: "happy",
  });
  const [playlist, setPlaylist] = useState([]); // array of songs
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  return (
    <SongContext.Provider
      value={{
        song,
        setSong,
        loading,
        setLoading,
        playlist,
        setPlaylist,
        currentIndex,
        setCurrentIndex,
      }}
    >
      {children}
    </SongContext.Provider>
  );
};
