import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-width-6x1 mx-auto px-4 py-4 flex justify-between item-center">
                <Link to="/" className="text-x1 font-bold text-blue-600">
                    Saas Platform
                </Link>

                <div className="flex item-center gap-4">
                    {user ? (
                        <>
                        <span className="text-gray-600">
                            Hello, {user.name}
                        </span>
                        <Link
                            to="/dashboard"
                            className="text-gray-600 hover:text-blue-600 text-sm"
                        >
                            Dashboard
                        </Link>
                        <button 
                            onClick={handleLogout} 
                            className="bg-red-500 text-4 px-2 py-2 rounded-lg text-sm hover:bg-red-600 transition"
                        >
                            Logout
                        </button>
                        </>
                    ) : (
                        <>
                        <Link 
                            to="/login" 
                            className="text-gray-600 px-4 py-2 hover:text-blue-600 text-sm"
                        >
                            Login
                        </Link>
                        <Link 
                            to="/register" 
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
                        >
                            Register
                        </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;