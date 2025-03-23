import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <img
            className="logo-img"
            src="/public/logo/WhatsApp Image 2025-03-16 at 10.58.45 PM (1).png"
            alt="My Image"
          />
        </Link>

        <div className={`nav-menu ${mobileMenuOpen ? "active" : ""}`}>
          <Link
            to="/servicespage"
            className="nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            الخدمات
          </Link>
          <Link
            to="/about"
            className="nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            من نحن
          </Link>
          <Link
            to="/contact"
            className="nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            اتصل بنا
          </Link>
          <Link
            to="/login"
            className="nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            تسجيل الدخول
          </Link>
          <Link
            to="/register"
            className="nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            إنشاء حساب
          </Link>
        </div>

        <div
          className={`burger-menu ${mobileMenuOpen ? "active" : ""}`}
          onClick={toggleMobileMenu}
        >
          <span className="burger-line"></span>
          <span className="burger-line"></span>
          <span className="burger-line"></span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
