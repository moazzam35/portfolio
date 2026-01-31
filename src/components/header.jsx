import "../App.css";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import React, { useState } from "react";
import logo from "../assets/images/logo.png";

function Header() {
  const [show, setShow] = useState(false);

  return (
    <header className="menu-head">
      <h1 className="header-inner font-bold text-yellow-400 ">
        {/* M<span className="text-white">oazzam</span>M */}
        <img href="#home" src={logo} alt="Logo" />
      </h1>

      <div className={show ? "menu-mobile" : "menu-web"}>
        <nav className="nav">
          <a href="#home" onClick={() => setShow(false)}>Home</a>
          <a href="#about" onClick={() => setShow(false)}>About</a>
          <a href="#projects" onClick={() => setShow(false)}>Projects</a>
          <a href="#contact" onClick={() => setShow(false)}>Contact</a>
        </nav>
      </div>

      <div className="ham-menu">
        <button onClick={() => setShow(!show)}>
          <AiOutlineMenuUnfold className="menu-icon" />
        </button>
      </div>
    </header>
  );
}

export default Header;
