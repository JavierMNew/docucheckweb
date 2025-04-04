import React from 'react';
import './Footer.css'; // Importa el archivo CSS

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <a href="/landing" className="footer-logo">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/5/53/Wikimedia-logo.png"
                className="footer-logo-image"
                alt="logo"
              />
              <span className="footer-logo-text">Docucheck</span>
            </a>
            <p className="footer-description">
              Sube, corrige y brilla con IA.
            </p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h2 className="footer-heading">Legal</h2>
              <ul className="footer-list">
                <li className="footer-item">
                  <a href="terminos.html" className="footer-link">Términos de uso</a>
                </li>
                <li className="footer-item">
                  <a href="politica.html" className="footer-link">Política de privacidad</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;