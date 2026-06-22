import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const api = axios.create({
    baseURL:BACKEND_URL,
    withCredentials:true
}) 

export async function getSong({mood}){
    const res = await api.get("/api/songs", {
        params: { mood },
    })
    return res.data;
    
}

export async function getSongPlaylist({mood}){
    const res = await api.get("/api/songs/playlist", {
        params: { mood, limit: 10 },
    })
    return res.data;
}
