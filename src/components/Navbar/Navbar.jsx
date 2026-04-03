import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { HiOutlineHome, HiOutlineUser, HiOutlineLogout } from "react-icons/hi";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/");
  };

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Matches Await", path: "/matches" },
    { name: "Success Stories", path: "/success-stories" },
    { name: "Contact", path: "/contact" },
  ];

  const Menu = ({ className, vertical }) => (
    <div className={`${className} ${vertical ? "flex flex-col gap-2" : "flex gap-6"}`}>
      {menuItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          className={({ isActive }) =>
            `relative py-1 text-orange-500 hover:text-orange-400 transition-colors duration-200 ${
              isActive ? "font-bold after:absolute after:-bottom-1 after:left-0 after:w-full after:h-1 after:bg-orange-500" : ""
            }`
          }
        >
          {item.name}
        </NavLink>
      ))}
    </div>
  );

  return (
    <div className="fixed top-0 left-0 w-full z-50 transition-all duration-300">
      <div className={`mx-auto rounded-xl flex items-center justify-between transition-all duration-300 ${
        scrolled ? "bg-white shadow-md w-11/12 px-6 py-2 mt-2" : "bg-transparent w-11/12 px-6 py-4"
      }`}>

        {/* Navbar Start */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu */}
          <div className="lg:hidden relative" ref={mobileMenuRef}>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="btn btn-ghost p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </button>
            {mobileMenuOpen && (
              <ul className="menu menu-sm bg-white rounded-box z-50 mt-3 w-52 p-2 shadow absolute left-0">
                <li><NavLink to="/" onClick={() => setMobileMenuOpen(false)}>Home</NavLink></li>
                <li><NavLink to="/success-stories" onClick={() => setMobileMenuOpen(false)}>Success Stories</NavLink></li>
                <li><NavLink to="/matches" onClick={() => setMobileMenuOpen(false)}>Matches Await</NavLink></li>
                <li><NavLink to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</NavLink></li>
                {!user && (
                  <>
                    <li className="mt-2 border-t border-gray-100 pt-2"><NavLink to="/login" onClick={() => setMobileMenuOpen(false)} className="text-orange-500 font-semibold">Login</NavLink></li>
                    <li><NavLink to="/register" onClick={() => setMobileMenuOpen(false)} className="text-orange-500 font-semibold">Sign Up</NavLink></li>
                  </>
                )}
                {user && (
                  <>
                    <li className="mt-2 border-t border-gray-100 pt-2">
                      <NavLink to={user.role === "admin" ? "/admin" : "/dashboard"} onClick={() => setMobileMenuOpen(false)} className="font-semibold">Dashboard</NavLink>
                    </li>
                    <li><button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="text-red-500 font-semibold text-left w-full px-3 py-2">Logout</button></li>
                  </>
                )}
              </ul>
            )}
          </div>

          {/* Logo */}
          <NavLink to="/" className="flex items-center">
            <img
              src="https://i.ibb.co.com/MDd996gn/logo-1-removebg-preview.png"
              alt="Logo"
              className="h-14 w-auto transition-all duration-300"
            />
          </NavLink>
        </div>

        {/* Center: Desktop Menu */}
        <div className="hidden lg:flex flex-1 justify-center">
          <Menu />
        </div>

        {/* Navbar End */}
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            /* User Avatar Dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-orange-400">
                  {user.profilePhoto?.url ? (
                    <img src={user.profilePhoto.url} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-orange-100 flex items-center justify-center text-orange-500 font-bold text-sm">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700">{user.name?.split(" ")[0]}</span>
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                  <NavLink
                    to={user.role === "admin" ? "/admin" : "/dashboard"}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition"
                  >
                    <HiOutlineHome className="w-4 h-4" /> Dashboard
                  </NavLink>
                  {user.role !== "admin" && (
                    <NavLink
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition"
                    >
                      <HiOutlineUser className="w-4 h-4" /> Profile
                    </NavLink>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition"
                  >
                    <HiOutlineLogout className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <NavLink to="/register" className={`btn rounded-xl px-5 transition-all duration-300 ${
                scrolled ? "bg-orange-500 text-white" : "bg-white text-orange-500"
              }`}>
                Sign Up
              </NavLink>
              <NavLink to="/login" className="btn btn-neutral text-white rounded-xl px-5">
                Login
              </NavLink>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
