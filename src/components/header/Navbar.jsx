import { useEffect, useState } from "react";
import "./styles/navbar.css";
import { Link } from "react-router-dom";
// eslint-disable-next-line react/prop-types
export function Navbar({ toogleSidebar }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const switchMode = document.getElementById("switch-mode");

    const handleChange = () => {
      setIsDarkMode(switchMode.checked);
    };

    switchMode.addEventListener("change", handleChange);

    return () => {
      switchMode.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <nav>
      <i className="bx bx-menu" onClick={toogleSidebar}></i>
      <a href="#" className="nav-link">
        Categorias
      </a>
      <form action="#">
        <div className="form-input">
          <input type="search" placeholder="Search..." />
          <button type="submit" className="search-btn">
            <i className="bx bx-search"></i>
          </button>
        </div>
      </form>
      <input type="checkbox" id="switch-mode" hidden />
      <label htmlFor="switch-mode" className="switch-mode"></label>
      <a href="#" className="notification">
        <i className="bx bxs-bell"></i>
        <span className="num">8</span>
      </a>
      <Link to={"/"} className="profile">
        <img src="../../assets/images/logo_ad.jpg" />
      </Link>
    </nav>
  );
}
