import {
  loginHandler,
  registerHandler,
  getmeHandler,
  logoutHandler,
} from "../services/auth.api";
import { useContext, useCallback } from "react";
import { AuthContext } from "../auth.context";

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const { user, setUser, loading, setLoading } = context;
  const extractUser = (res) => res?.user ?? res?.userData ?? null;

  const handleRegister = async (payload) => {
    try {
      setLoading(true);
      const res = await registerHandler(payload);
      setUser(extractUser(res));
      return res;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (credentials) => {
    try {
      setLoading(true);
      const res = await loginHandler(credentials);
      setUser(extractUser(res));
      return res;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleGetMe = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getmeHandler();
      setUser(extractUser(res));
      return res;
    } catch (error) {
      setUser(null);
      console.log(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setUser]);

  // useEffect(() => {
  //   handleGetMe();
  // }, [handleGetMe]);

  const handleLogout = async () => {
    try {
      setLoading(true);
      const res = await logoutHandler();
      setUser(null);
      return res;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  

  return { user, loading, handleRegister, handleLogin, handleGetMe, handleLogout };
};
