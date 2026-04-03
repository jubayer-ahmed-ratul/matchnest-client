import React from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 md:py-14 ">
      <div className="w-11/12 mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
        
        {/* Logo + About - Full width on mobile, left on desktop */}
        <div className="text-center md:text-left">
          <div className="flex justify-center md:justify-start">
            <NavLink to="/">
              <img src="https://i.ibb.co/Kc5ZbjT4/logo-1-removebg-preview.png" alt="Logo" className="h-12 md:h-14" />
            </NavLink>
          </div>
          <p className="text-gray-400 leading-relaxed mt-4 text-sm md:text-base">
            MatchNest connects hearts with trust, privacy, and meaningful
            relationships. Your journey towards love begins here.
          </p>
        </div>

        {/* Quick Links - Full width on mobile, center on desktop */}
        <div className="flex justify-center">
          <div className="text-center md:text-left">
            <h3 className="text-white text-lg md:text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <NavLink to="/" className="hover:text-orange-400 transition block">
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/success-stories" className="hover:text-orange-400 transition block">
                  Success Stories
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" className="hover:text-orange-400 transition block">
                  Contact Us
                </NavLink>
              </li>
              <li>
                <NavLink to="/login" className="hover:text-orange-400 transition block">
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink to="/register" className="hover:text-orange-400 transition block">
                  Register
                </NavLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media - Full width on mobile, right on desktop */}
        <div className="flex justify-center md:justify-end">
          <div className="text-center md:text-left">
            <h3 className="text-white text-lg md:text-xl font-semibold mb-4">Follow Us</h3>
            <div className="flex items-center justify-center md:justify-start gap-4 md:gap-5 text-xl md:text-2xl">
              <a href="#" className="hover:text-orange-400 transition">
                <FaFacebook />
              </a>
              <a href="#" className="hover:text-orange-400 transition">
                <FaInstagram />
              </a>
              <a href="#" className="hover:text-orange-400 transition">
                <FaTwitter />
              </a>
              <a href="#" className="hover:text-orange-400 transition">
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="border-t border-gray-700 mt-8 md:mt-10 pt-6 text-center text-gray-500 text-sm md:text-base">
        © {new Date().getFullYear()} MatchNest. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;