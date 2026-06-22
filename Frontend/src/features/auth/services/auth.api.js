import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL 
const api = axios.create({
    baseURL:`${BACKEND_URL}/api/auth`,
    withCredentials:true
})



export async function registerHandler({email,username,password}){
    const res = await api.post("/register",{email,username,password});
    return res.data;
}

export async function loginHandler({email,username,password}){
    const res = await api.post("/login",{email,username, password});
    return res.data;
}

export async function getmeHandler(){
    const res = await api.get("/get-me")
    return res.data;
}

export async function logoutHandler(){
    const res = await api.post("/logout");
    return res.data;
} 
