import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link
          to={token ? "/dashboard" : "/"}
          className="flex items-center space-x-2"
        >
          <svg
            className="h-8 w-8 text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h1 className="text-xl font-bold tracking-tight text-white">
            PDF Manager
          </h1>
        </Link>

        <div className="flex items-center space-x-1 md:space-x-4">
          {token ? (
            <>
              <Link
                to="/dashboard"
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 transition hover:bg-gray-700 hover:text-white"
              >
                Dashboard
              </Link>
              <Link
                to="/upload"
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 transition hover:bg-gray-700 hover:text-white"
              >
                Upload
              </Link>
              <button
                onClick={handleLogout}
                className="ml-2 rounded-md bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 text-sm font-medium text-white transition hover:from-red-600 hover:to-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-none"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/"
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 transition hover:bg-gray-700 hover:text-white"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-md bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:from-blue-600 hover:to-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-none"
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
