import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';

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
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <ProductsPage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </div>
  );
}

export default App;