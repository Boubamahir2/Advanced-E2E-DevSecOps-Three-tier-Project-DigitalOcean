import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import React from "react";
import Wrapper from "../assets/wrappers/Navbar";
import { FaAlignLeft, FaUserCircle, FaCaretDown } from "react-icons/fa";
import Logo from "./Logo";
import { toggleSidebar } from "../features/user/userSlice";
import { clearStore } from "../features/user/userSlice";

const Navbar = () => {
  const [showLogout, setShowLogout] = useState(false);
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const toggle = () => {
    dispatch(toggleSidebar());
  };

  return (
    <Wrapper>
      <div className="nav-center">
        <button className="toggle-btn" onClick={toggle}>
          <FaAlignLeft />
        </button>
        <div>
          <Logo />
          <h3 className="logo-text">Dashboard</h3>
        </div>
        <div className="btn-container">
          <button
            className="btn"
            type="button"
            onClick={() => setShowLogout(!showLogout)}
          >
            <FaUserCircle />
            {user.user?.name}
            <FaCaretDown />
          </button>
          <div
            className={`${showLogout ? "dropdown show-dropdown" : "dropdown"}`}
          >
            <button
              className="dropdown-btn"
              onClick={() => dispatch(clearStore("Logging Out..."))}
              type="button"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default Navbar;
