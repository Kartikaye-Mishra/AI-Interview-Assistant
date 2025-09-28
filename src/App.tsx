import { BrowserRouter, Route, Routes } from "react-router";
import AuthPage from "./pages/Auth";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";

export default function App() {
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

