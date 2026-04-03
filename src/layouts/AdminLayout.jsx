import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  HiOutlineChartBar,
  HiOutlineUsers,
  HiOutlineClock,
  HiOutlineSparkles,
  HiOutlineMail,
  HiOutlineCreditCard,
  HiOutlineLogout,
} from "react-icons/hi";

const navItems = [
  { label: "Overview", path: "/admin", icon: HiOutlineChartBar },
  { label: "All Users", path: "/admin/users", icon: HiOutlineUsers },
  { label: "Pending Verification", path: "/admin/pending", icon: HiOutlineClock },
  { label: "Success Stories", path: "/admin/stories", icon: HiOutlineSparkles },
  { label: "Messages", path: "/admin/messages", icon: HiOutlineMail },
  { label: "Payments", path: "/admin/payments", icon: HiOutlineCreditCard },
];

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const currentPage = navItems.find((item) =>
    item.path === "/admin" ? location.pathname === "/admin" : location.pathname.startsWith(item.path)
  )?.label || "Admin Panel";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col hidden md:flex border-r border-gray-100">
        {/* Logo */}
        <div className="p-5 border-b border-gray-100">
          <NavLink to="/">
            <img src="https://i.ibb.co.com/MDd996gn/logo-1-removebg-preview.png" alt="MatchNest" className="h-12 w-auto" />
          </NavLink>
          <p className="text-xs text-orange-500 font-semibold mt-1">Admin Panel</p>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-4 flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
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
            <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
              <p className="text-xs text-orange-500 font-medium">Administrator</p>
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

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between border-b border-gray-100">
          <div></div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 hidden md:block">{user?.name}</span>
            <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-bold text-sm overflow-hidden">
              {user?.profilePhoto?.url
                ? <img src={user.profilePhoto.url} alt="" className="w-full h-full object-cover" />
                : user?.name?.charAt(0).toUpperCase()
              }
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
