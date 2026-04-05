import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// Protected route — redirect ke login kalau belum login
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Tunggu dulu sampai proses cek token selesai
  if (loading) return <div className="text-center py-10">Loading...</div>;

  // Kalau belum login → lempar ke login
  if (!user) return <Navigate to="/login" />;

  // Kalau sudah login → boleh masuk
  return children;
};

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;