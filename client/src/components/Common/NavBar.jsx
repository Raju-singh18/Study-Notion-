import React, { useState } from "react";
import logo from "../../assets/Logo/Logo-Full-Light.png";
import { Link, matchPath } from "react-router-dom";
import { NavbarLinks } from "../../data/navbar-links";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { TiShoppingCart } from "react-icons/ti";
import ProfileDropDown from "../core/Auth/ProfileDropDown";
import { categories } from "../../services/apis";
import { apiConnector } from "../../services/apiConnector";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { useRef } from "react";
import { HiSearch } from "react-icons/hi";
import { useNavigate } from "react-router";
import { IoIosArrowDown } from "react-icons/io";

const NavBar = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const location = useLocation();

  const [subLinks, setSubLinks] = useState([]);

  const fetchSublinks = async () => {
    try {
      const result = await apiConnector("GET", categories.CATALOGPAGEDATA_API);
      // console.log("Printing Sublinks results:", result);
      setSubLinks(result.data.data);
    } catch (error) {
      console.log("Error during fetching categories list for catalog");
      console.error(error);
    }
  };
  useEffect(() => {
    fetchSublinks();
  }, []);

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };
  return (
    <div className="flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700">
      <div className="flex w-11/12 max-w-maxcontent items-center justify-between">
        {/* image */}
        <Link to="/">
          <img src={logo} alt="" width={160} height={42} loading="lazy" />
        </Link>

        {/* navlinks */}
        <nav>
          <ul className="flex gap-x-6 text-richblack-25">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <div
                    className={`relative flex items-center gap-2 group ${
                      matchRoute("/catalog/:catalogName")
                        ? "text-yellow-25"
                        : "text-richblack-25"
                    }`}
                  >
                    <p>{link.title}</p>
                    <IoIosArrowDown />

                    <div className="invisible absolute left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-4 flex flex-col rounded-md bg-richblack-700 p-4 text-richblack-900 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 lg:w-[220px]">
                      <div className="absolute translate-x-[80%] translate-y-[-30%] left-[50%] top-0 h-6 w-6 rotate-45 bg-richblack-700"></div>
                      {subLinks.length ? (
                        subLinks.map((subLink, index) => (
                          <Link
                            to={`/catalog/${subLink.name
                              .split(" ")
                              .join("-")
                              .toLowerCase()}`}
                            key={index}
                          >
                            <p className="text-richblack-50">
                              {index + 1}. {subLink.name}
                            </p>
                            <div className="border-b-2 border-b-richblack-200"></div>
                          </Link>
                        ))
                      ) : (
                        <p>No Category found</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <Link to={link?.path}>
                    <p
                      className={`${
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
          </ul>
        </nav>

        {/* login/signup/dashboard */}
        <div className="flex gap-x-4 items-center">
          {user && user.accountType != "Instructor" && user.accountType != "Admin" && (
            <Link to="/dashboard/cart" className="relative">
              <TiShoppingCart className="text-2xl" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-semibold text-white shadow-lg">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {token === null && (
            <Link to="/login">
              <button className="border border-richblack-700 px-[12px] py-[8px] text-richblack-100 rounded-md">
                Log in
              </button>
            </Link>
          )}
          {token === null && (
            <Link to="/signup">
              <button className="border border-richblack-700 px-[12px] py-[8px] text-richblack-100 rounded-md">
                Sign Up
              </button>
            </Link>
          )}
          {token !== null && <ProfileDropDown />}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
