import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "../Logo";
import { BiCart } from "react-icons/bi";
import { NavLinks } from "./NavLinks";
import { IoMdLogIn } from "react-icons/io";
import { RiArrowDropDownLine } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import { supabase } from "../Auth/supabaseClient";

export const Navbar = () => {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [hamburgerMenuOpen, setHamburgerMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, []);

  const handleUserIconClick = () => {
    navigate(user ? "/profile" : "/select");
  };

  // ✅ Close hamburger menu when a link is clicked
  const handleHamburgerLinkClick = () => {
    setHamburgerMenuOpen(false);
  };

  return (
    <>
      <nav className="px-4 flex items-center justify-between relative z-50 bg-white">
        <Link to="/">
          <Logo />
        </Link>

        {/* Hamburger Icon */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setHamburgerMenuOpen(true)}
            className="text-black text-5xl"
          >
            &#9776;
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex gap-4 items-center">
          <NavLinks to="/" title="Home" />

          <div className="relative">
            <button
              onClick={() => setServicesOpen(!servicesOpen)}
              className="flex items-center gap-1 text-black"
            >
              Services
              <RiArrowDropDownLine className="text-2xl text-[#cf2c2c]" />
            </button>

            {servicesOpen && (
              <div className="absolute top-full left-0 mt-2 w-40 bg-white shadow-lg rounded-lg py-2 z-50">
                <Link to="/order" className="block px-4 py-2 hover:bg-gray-100">
                  Order
                </Link>
                <Link to="/aiassistant" className="block px-4 py-2 hover:bg-gray-100">
                  AI Assistant
                </Link>
                <Link to="/blockchain" className="block px-4 py-2 hover:bg-gray-100">
                  Blockchain
                </Link>
              </div>
            )}
          </div>

          <NavLinks to="/shop" title="Shop" />
          <NavLinks to="/about" title="About" />
          <NavLinks to="/contact" title="Contact" />
          <NavLinks to="/profile" title="Profile" />
          <NavLinks to="/vendor" title="Vendors Corner" />
        </div>

        {/* Desktop Icons */}
        <div className="hidden lg:flex gap-4 items-center">
          <Link to="/cart">
            <div className="bg-[#a82f17] w-11 p-2 rounded-full">
              <BiCart className="text-3xl text-white" />
            </div>
          </Link>

          <div
            onClick={handleUserIconClick}
            className="bg-[#a82f17] w-11 p-2 rounded-full cursor-pointer"
          >
            {user ? (
              <FaUser className="text-3xl text-white" />
            ) : (
              <IoMdLogIn className="text-3xl text-white" />
            )}
          </div>
        </div>
      </nav>

      {/* Hamburger Menu */}
      <div
        className={`lg:hidden bg-white fixed top-0 left-0 w-full h-screen transition-transform duration-300 ${
          hamburgerMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ zIndex: 999 }}
      >
        {/* Close Button */}
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setHamburgerMenuOpen(false)}
            className="text-3xl"
          >
            &#10005;
          </button>
        </div>

        <div className="flex flex-col items-center mt-28 px-6">
          <nav className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6 space-y-3">
            {[
              { to: "/", label: "Home" },
              { to: "/about", label: "About" },
              { to: "/shop", label: "Order" },
              { to: "/shop", label: "Shop" },
              { to: "/profile", label: "Profile" },
              { to: "/contact", label: "Contact" },
              { to: "/vendor", label: "Vendor’s Corner" },
              { to: "/cart", label: "Cart" },
              { to: "/select", label: "Sign in" },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={handleHamburgerLinkClick} // ✅ CLOSE MENU
              >
                <div className="group flex items-center justify-between px-5 py-3 rounded-xl transition-all duration-300 hover:bg-orange-50 hover:scale-[1.02] active:scale-95">
                  <p className="font-fredoka text-lg font-semibold text-gray-800 group-hover:text-orange-600">
                    {item.label}
                  </p>
                  <span className="text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <hr className="mt-4" />
    </>
  );
};
