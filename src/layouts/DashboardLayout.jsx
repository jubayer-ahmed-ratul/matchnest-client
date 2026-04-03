import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  HiOutlineHome,
  HiOutlineSearch,
  HiOutlineHeart,
  HiOutlineChatAlt2,
  HiOutlineUser,
  HiOutlineSparkles,
  HiOutlineLogout,
  HiOutlineGlobe,
} from "react-icons/hi";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: HiOutlineHome },
  { label: "Browse", path: "/search", icon: HiOutlineSearch },
  { label: "Interests", path: "/interests", icon: HiOutlineHeart },
  { label: "Messages", path: "/messages", icon: HiOutlineChatAlt2 },
  { label: "Profile", path: "/profile", icon: HiOutlineUser },
  { label: "Share Story", path: "/submit-story", icon: HiOutlineSparkles },
];

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const currentPage = navItems.find((item) =>
    item.path === "/dashboard" ? location.pathname === "/dashboard" : location.pathname.startsWith(item.path)
  )?.label || "Dashboard";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex-col hidden md:flex border-r border-gray-100 h-screen sticky top-0">
        {/* Logo */}
        <div className="p-5 border-b border-gray-100">
          <NavLink to="/">
            <img src="https://i.ibb.co.com/MDd996gn/logo-1-removebg-preview.png" alt="MatchNest" className="h-12 w-auto" />
          </NavLink>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-4 flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-orange-500 text-white shadow-sm"
                    : "text-gray-600 hover:bg-orange-50 hover:text-orange-500"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User info + logout */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-bold text-sm overflow-hidden">
              {user?.profilePhoto?.url
                ? <img src={user.profilePhoto.url} alt="" className="w-full h-full object-cover" />
                : user?.name?.charAt(0).toUpperCase()
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl transition"
          >
            <HiOutlineLogout className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between border-b border-gray-100">
          <NavLink to="/"><img src="https://i.ibb.co.com/MDd996gn/logo-1-removebg-preview.png" alt="MatchNest" className="h-14 w-auto md:hidden" /></NavLink>
          <div className="hidden md:block"></div>

          {/* Mobile nav */}
          <div className="flex gap-1 md:hidden">
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path}
                className={({ isActive }) => `p-2 rounded-lg ${isActive ? "bg-orange-500 text-white" : "text-gray-500"}`}>
                <item.icon className="w-5 h-5" />
              </NavLink>
            ))}
          </div>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-3">
            <NavLink to="/" className="flex items-center gap-1 text-sm text-gray-500 hover:text-orange-500 transition">
              <HiOutlineGlobe className="w-4 h-4" /> Homepage
            </NavLink>
            <span className={`text-xs px-2 py-1 rounded-full font-semibold ${user?.profileStatus === "verified" ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"}`}>
              {user?.profileStatus}
            </span>
            <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-bold text-sm overflow-hidden">
              {user?.profilePhoto?.url
                ? <img src={user.profilePhoto.url} alt="" className="w-full h-full object-cover" />
                : user?.name?.charAt(0).toUpperCase()
              }
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-y-auto h-full">
          {children}
        </main>
      </div>
    </div>
  );
}
