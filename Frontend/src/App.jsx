import { RouterProvider } from "react-router"
import { router } from "./app.routes.jsx"
import "./features/shared/styles/global.scss"
import { AuthProvider } from "./features/auth/Auth.context.jsx"
import { SongProvider } from "./features/home/Song.context.jsx"

const App = () => {
  return (
    <AuthProvider>
      <SongProvider>
        <RouterProvider router={router} />
      </SongProvider>
    </AuthProvider>
  )
}

export default App