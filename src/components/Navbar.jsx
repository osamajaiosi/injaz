import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [showServices, setShowServices] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const servicesRef = useRef(null);

  const services = [
    { name: "خدمات تعليمية", path: "/services/educational" },
    { name: "خدمات إبداعية", path: "/services/creative" },
    { name: "خدمات تقنية", path: "/services/technical" },
    { name: "خدمات فعاليات", path: "/services/events" },
    { name: "خدمات الرعاية", path: "/services/care" },
    { name: "خدمات صحية", path: "/services/health" },
    { name: "خدمات تسويق", path: "/services/marketing" },
    { name: "خدمات ترجمة", path: "/services/translation" },
    { name: "خدمات نقل", path: "/services/transportation" },
    { name: "خدمات متنوعة", path: "/services/misc" },
    { name: "خدمات مهنية", path: "/services/professional" },
  ];

  // Group services by category for a more compact display
  const serviceCategories = [
    [
      { name: "خدمات تعليمية", path: "/services/educational" },
      { name: "خدمات إبداعية", path: "/services/creative" },
      { name: "خدمات تقنية", path: "/services/technical" },
      { name: "خدمات فعاليات", path: "/services/events" },
    ],
    [
      { name: "خدمات الرعاية", path: "/services/care" },
      { name: "خدمات صحية", path: "/services/health" },
      { name: "خدمات تسويق", path: "/services/marketing" },
      { name: "خدمات ترجمة", path: "/services/translation" },
    ],
    [
      { name: "خدمات نقل", path: "/services/transportation" },
      { name: "خدمات متنوعة", path: "/services/misc" },
      { name: "خدمات مهنية", path: "/services/professional" },
    ],
  ];

  const flatServices = services; // Keep the original array for mobile view

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    // Close services dropdown when closing mobile menu
    if (mobileMenuOpen) setShowServices(false);
  };

  const toggleServices = (e) => {
    // For mobile, toggle the dropdown
    if (window.innerWidth <= 768) {
      e.preventDefault();
      e.stopPropagation();
      setShowServices(!showServices);
    }
  };

  // Close services dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (servicesRef.current && !servicesRef.current.contains(event.target)) {
        setShowServices(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Add scroll detection for navbar styling
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
          <div className="nav-item services-item" ref={servicesRef}>
            <div
              className="nav-link services-link"
              onClick={toggleServices}
              onMouseEnter={() =>
                window.innerWidth > 768 && setShowServices(true)
              }
              onMouseLeave={() =>
                window.innerWidth > 768 && setShowServices(false)
              }
            >
              الخدمات
              <i className={`dropdown-icon ${showServices ? "rotate" : ""}`}>
                ▼
              </i>
            </div>
            <div className={`services-dropdown ${showServices ? "show" : ""}`}>
              <div className="services-grid">
                {window.innerWidth <= 768
                  ? flatServices.map((service, index) => (
                      <Link
                        key={index}
                        to={service.path}
                        className="dropdown-link"
                        onClick={() => {
                          setShowServices(false);
                          setMobileMenuOpen(false);
                        }}
                      >
                        {service.name}
                      </Link>
                    ))
                  : serviceCategories.flat().map((service, index) => (
                      <Link
                        key={index}
                        to={service.path}
                        className="dropdown-link"
                        onClick={() => {
                          setShowServices(false);
                          setMobileMenuOpen(false);
                        }}
                      >
                        {service.name}
                      </Link>
                    ))}
              </div>
            </div>
          </div>
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
            className="nav-link "
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
