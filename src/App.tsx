import { BrowserRouter, Route, Routes } from "react-router";
import AuthPage from "./pages/Auth";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import { useEffect } from "react";

export default function App() {
   useEffect(() => {
    const wakeUpBackend = async () => {
      try {
        await fetch(import.meta.env.VITE_BACKEND_URL + "/ping");
      } catch (err) {
        console.error("Backend wake-up failed:", err);
      }
    };

    wakeUpBackend();
  }, []);
  return (
    
            <BrowserRouter>
          <Routes />
          <Routes>
            <Route path="/" element={    <Landing />} />
            <Route path="/auth" element={    <AuthPage />} />
            <Route path="/dashboard" element={    <Dashboard />} />

         
          </Routes>
        </BrowserRouter>

  
  )
}

