import React, { useState, useEffect, useRef } from "react";
import logo from "../../assets/Logo/Logo-Full-Light.png";
import { Link, matchPath, useLocation } from "react-router-dom";
import { NavbarLinks } from "../../data/navbar-links";
import { useSelector } from "react-redux";
import { TiShoppingCart } from "react-icons/ti";
import ProfileDropDown from "../core/Auth/ProfileDropDown";
import { categories } from "../../services/apis";
import { apiConnector } from "../../services/apiConnector";
import { IoIosArrowDown } from "react-icons/io";
import { FaBars, FaTimes } from "react-icons/fa";

const NavBar = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const location = useLocation();

  const [subLinks, setSubLinks] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const menuRef = useRef(null);

  // Fetch catalog links
  const fetchSublinks = async () => {
    try {
      const result = await apiConnector("GET", categories.CATALOGPAGEDATA_API);
      setSubLinks(result.data.data);
    } catch (error) {
      console.log("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchSublinks();
  }, []);

  const matchRoute = (route) => matchPath({ path: route }, location.pathname);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
        setCatalogOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menu when navigating to a new route
  useEffect(() => {
    setMenuOpen(false);
    setCatalogOpen(false);
  }, [location.pathname]);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-richblack-900 border-b border-richblack-700">
      <div className="flex items-center justify-between w-11/12 max-w-maxcontent mx-auto h-16">
        {/* Logo */}
        <Link to="/" onClick={() => setMenuOpen(false)}>
          <img src={logo} alt="Logo" width={160} height={42} loading="lazy" />
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center gap-x-6 text-richblack-25">
          {NavbarLinks.map((link, index) => (
            <li key={index} className="list-none relative group">
              {link.title === "Catalog" ? (
                <div
                  className={`flex items-center gap-1 cursor-pointer ${
                    matchRoute("/catalog/:catalogName")
                      ? "text-yellow-25"
                      : "text-richblack-25"
                  }`}
                >
                  <span>{link.title}</span>
                  <IoIosArrowDown className="text-sm mt-[2px]" />

                  {/* Dropdown */}
                  <div className="invisible absolute left-0 top-full mt-2 z-50 rounded-md bg-richblack-700 p-3 text-richblack-25 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 w-56 shadow-lg">
                    {subLinks.length ? (
                      subLinks.map((subLink, i) => (
                        <Link
                          key={i}
                          to={`/catalog/${subLink.name
                            .split(" ")
                            .join("-")
                            .toLowerCase()}`}
                          className="block px-2 py-1 rounded hover:bg-richblack-600 transition"
                        >
                          {i + 1}. {subLink.name}
                        </Link>
                      ))
                    ) : (
                      <p className="px-2 text-sm text-richblack-100">
                        No categories found
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <Link to={link?.path}>
                  <p
                    className={`hover:text-yellow-25 transition ${
                      matchRoute(link?.path)
                        ? "text-yellow-25"
                        : "text-richblack-25"
                    }`}
                  >
                    {link.title}
                  </p>
                </Link>
              )}
            </li>
          ))}
        </nav>

        {/* Right Side (Desktop) */}
        <div className="hidden lg:flex items-center gap-x-4">
          {user &&
            user.accountType !== "Instructor" &&
            user.accountType !== "Admin" && (
              <Link to="/dashboard/cart" className="relative">
                <TiShoppingCart className="text-2xl text-white" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-semibold text-white shadow-lg">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}

          {token === null && (
            <>
              <Link to="/login">
                <button className="border border-richblack-700 px-3 py-1.5 text-richblack-100 rounded-md hover:bg-richblack-700 transition">
                  Log in
                </button>
              </Link>
              <Link to="/signup">
                <button className="border border-richblack-700 px-3 py-1.5 text-richblack-100 rounded-md hover:bg-richblack-700 transition">
                  Sign Up
                </button>
              </Link>
            </>
          )}

          {token !== null && <ProfileDropDown />}
        </div>

        {/* Mobile Hamburger Icon */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden text-white text-3xl focus:outline-none"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className={`lg:hidden fixed inset-0 bg-richblack-900/95 backdrop-blur-md flex flex-col items-center justify-center gap-6 text-white text-lg transform transition-all duration-500 ease-in-out ${
          menuOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        {/* Cross button inside mobile menu */}
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-6 right-6 text-3xl text-white hover:text-yellow-25 transition"
        >
          <FaTimes />
        </button>

        {NavbarLinks.map((link, index) => (
          <div key={index} className="text-center">
            {link.title === "Catalog" ? (
              <div className="flex flex-col items-center">
                <button
                  onClick={() => setCatalogOpen(!catalogOpen)}
                  className="flex items-center gap-2 text-xl font-semibold"
                >
                  {link.title}
                  <IoIosArrowDown
                    className={`transition-transform ${
                      catalogOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Collapsible sublinks on mobile */}
                {catalogOpen && (
                  <div className="mt-2 flex flex-col items-center gap-2 text-base">
                    {subLinks.length ? (
                      subLinks.map((subLink, i) => (
                        <Link
                          key={i}
                          to={`/catalog/${subLink.name
                            .split(" ")
                            .join("-")
                            .toLowerCase()}`}
                          onClick={() => {
                            setMenuOpen(false);
                            setCatalogOpen(false);
                          }}
                          className="hover:text-yellow-25 transition"
                        >
                          {i + 1}. {subLink.name}
                        </Link>
                      ))
                    ) : (
                      <p>No categories found</p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <Link
                to={link?.path}
                onClick={() => setMenuOpen(false)}
                className="hover:text-yellow-25 transition"
              >
                {link.title}
              </Link>
            )}
          </div>
        ))}

        {/* Mobile Bottom Buttons */}
        <div className="flex flex-col items-center gap-4 mt-6">
          {user &&
            user.accountType !== "Instructor" &&
            user.accountType !== "Admin" && (
              <Link to="/dashboard/cart" onClick={() => setMenuOpen(false)}>
                <div className="relative">
                  <TiShoppingCart className="text-3xl" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center rounded-full bg-red-600 text-xs text-white">
                      {totalItems}
                    </span>
                  )}
                </div>
              </Link>
            )}

          {token === null && (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                <button className="border border-richblack-700 px-4 py-2 text-white rounded-md hover:bg-richblack-700 transition">
                  Log in
                </button>
              </Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)}>
                <button className="border border-richblack-700 px-4 py-2 text-white rounded-md hover:bg-richblack-700 transition">
                  Sign Up
                </button>
              </Link>
            </>
          )}

          {token !== null && <ProfileDropDown />}
        </div>
      </div>
    </header>
  );
};

export default NavBar;
