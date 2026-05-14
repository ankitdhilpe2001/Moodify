import { getSong } from "../service/song.api";
import { useContext } from "react";
import { SongContext } from "../song.context";

export const useSong = () => {
  const context = useContext(SongContext);

  if (!context) {
    throw new Error("useSong must be used with the context");
  }

  const { song, setSong, loading, setLoading } = context;

  async function handleGetSong({ mood }) {
    try {
      setLoading(true);
      const data = await getSong({ mood });
      setSong(data.song);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    handleGetSong,
    song,
  };
};
