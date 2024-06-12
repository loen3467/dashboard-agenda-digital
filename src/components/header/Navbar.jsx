import { useEffect, useState } from "react";
import PropTypes from "prop-types"; // Importa PropTypes
import "./styles/navbar.css";

export function Navbar({ toggleSidebar }) {
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
      <i className="bx bx-menu" onClick={toggleSidebar}></i>
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
      <a href="#" className="profile">
        <img src="../../assets/images/people.png" alt="profile" />
      </a>
    </nav>
  );
}

// Define PropTypes para Navbar
Navbar.propTypes = {
  toggleSidebar: PropTypes.func.isRequired, // Asegura que toggleSidebar sea una función requerida
};
