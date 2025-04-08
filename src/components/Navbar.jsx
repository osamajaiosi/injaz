import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import "./Navbar.css";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { userType, logout } = useAuth();
  console.log(userType); // لرؤية قيمة userType في الكونسول

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <img
            className="logo-img"
            src="/logo/WhatsApp Image 2025-03-16 at 10.58.45 PM (1).png"
            alt="My Image"
          />
        </Link>

        <div className={`nav-menu ${mobileMenuOpen ? "active" : ""}`}>
          {/* -------------------- روابط عامة تظهر فقط إذا لم يكن المستخدم طالب -------------------- */}
          {userType !== "student" && (
            <>
              <Link
                to="/servicespage"
                className="nav-link"
                onClick={toggleMobileMenu}
              >
                الخدمات
              </Link>
              <Link to="/about" className="nav-link" onClick={toggleMobileMenu}>
                من نحن
              </Link>
              <Link
                to="/contact"
                className="nav-link"
                onClick={toggleMobileMenu}
              >
                اتصل بنا
              </Link>
            </>
          )}

          {/* -------------------- الضيف -------------------- */}
          {userType === "guest" && (
            <>
              <Link to="/login" className="nav-link" onClick={toggleMobileMenu}>
                تسجيل الدخول
              </Link>
              <Link
                to="/register"
                className="nav-link"
                onClick={toggleMobileMenu}
              >
                إنشاء حساب
              </Link>
            </>
          )}

          {/* -------------------- الطالب -------------------- */}
          {userType === "student" && (
            <>
              <Link
                to="/Dashboard"
                className="nav-link"
                onClick={toggleMobileMenu}
              >
                لوحة التحكم{" "}
              </Link>
              <Link
                to="/Dashboard"
                className="nav-link"
                onClick={toggleMobileMenu}
              >
                اعلاناتي
              </Link>
              <Link
                to="/student-dashboard"
                className="nav-link"
                onClick={toggleMobileMenu}
              >
                طلباتي
              </Link>
              <span
                className="nav-link"
                onClick={() => {
                  logout();
                  toggleMobileMenu();
                }}
              >
                تسجيل الخروج
              </span>
              <Link to="/student-settings" onClick={toggleMobileMenu}>
                <img
                  src="/public/avatar/avatar.png"
                  alt="إعدادات الطالب"
                  className="avatar-img"
                  style={{
                    width: "65px",
                    height: "65px",
                    borderRadius: "50%",
                    cursor: "pointer",
                    marginRight: "10px",
                    marginTop: "10px",
                  }}
                />
              </Link>
            </>
          )}

          {/* -------------------- يوزر عادي -------------------- */}
          {userType === "user" && (
            <>
              <Link
                to="/Dashboard"
                className="nav-link"
                onClick={toggleMobileMenu}
              >
                الطلبات
              </Link>
              <span
                className="nav-link"
                onClick={() => {
                  logout();
                  toggleMobileMenu();
                }}
              >
                تسجيل الخروج
              </span>
              <Link to="/user-settings" onClick={toggleMobileMenu}>
                <img
                  src="/public/avatar/avatar.png"
                  alt="إعدادات يوزر عادي"
                  className="avatar-img"
                  style={{
                    width: "65px",
                    height: "65px",
                    borderRadius: "50%",
                    cursor: "pointer",
                    marginRight: "10px",
                    marginTop: "10px",
                  }}
                />
              </Link>
            </>
          )}
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
