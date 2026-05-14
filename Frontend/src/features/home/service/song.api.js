import axios from "axios";

const api = axios.create({
    baseURL:"http://localhost:8080/",
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
