import React from "react";
import "../styles/Navbar.css";

const Navbar = () => {
  return (
    <nav className='navbar'>
      <div className='logo'>Vendor Village</div>
      <button className='logout-btn'>Logout</button>
    </nav>
  );
};

export default Navbar;
