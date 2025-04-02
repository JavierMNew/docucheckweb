import React from "react";
import "./Header.css"; // Asegúrate de crear este archivo para los estilos

const Header = () => {
  return (
    <header className="header">
      <nav className="header-nav">
        <ul className="nav-list">
          <li className="nav-item">
            <a href="landing.html" className="nav-link">
              Inicio
            </a>
          </li>
          <li className="nav-item">
            <a href="/" className="nav-link">
              Servicio
            </a>
          </li>
          <li className="nav-item">
            <a href="contacto.html" className="nav-link">
              Contacto
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
