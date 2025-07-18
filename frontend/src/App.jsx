import {BrowserRouter, Routes, Route, useNavigate} from "react-router-dom";
import { QueryClientProvider, QueryClient} from "@tanstack/react-query";
import MainLayout from "./layouts/main-layout";
import ProtectedRoute from "./components/protected-route";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Todos from "./pages/todos";
import { useEffect } from "react";

const client = new QueryClient();

function RedirectToLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/login")
  }, [])

  

  return <></>
}

function App() {
  return (
    <QueryClientProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
