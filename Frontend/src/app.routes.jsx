import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/Login.jsx";
import Home from "./features/home/pages/Home.jsx";
import Register from "./features/auth/pages/Register.jsx";
import ProtectedRoute from "./features/auth/components/ProtectedRoute.jsx";
import PublicRoute from "./features/auth/components/PublicRoute.jsx";

export const router = createBrowserRouter([
    {
        path:"/",
        element:<PublicRoute><Login/></PublicRoute>
    },
    {
        path:"/home",
        element:<ProtectedRoute><Home/></ProtectedRoute>
    },
    {
        path:"/register",
        element:<Register/>
    },
    {
        path:"/login",
        element:<PublicRoute><Login/></PublicRoute>
    }
])
