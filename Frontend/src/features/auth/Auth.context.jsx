import { useState, useEffect } from "react";
import { AuthContext } from "./auth.context"
import { getmeHandler } from "./services/auth.api";

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const extractUser = (res) => res?.user ?? res?.userData ?? null;

    useEffect(() => {
        const hydrateAuthUser = async () => {
            try {
                const res = await getmeHandler();
                const currentUser = extractUser(res);
                setUser(currentUser || null);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        hydrateAuthUser();
    }, [])



    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    )
} 

{/*
    what is the hydrateAuthUser?
    the hydrateAuthUser is a function which calls the getMehandler api which is a protected route meaning that to call the getMe()
    user should be Logged In before then the api call can be done which returns the user info. If the hydrateUser is not present 
    then if log IN and refresh the website we'll be redirected to login page due to the handleLogin function flow 

🔄 Clean mental model
Think like this:

💬 “Hey backend, do I already have a valid token?”

* If YES → user is returned → setUser(user)
* If NO → error → setUser(null)
    

*/}