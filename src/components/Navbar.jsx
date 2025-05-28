import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import "./Navbar.css";
import UserDropdown from "../pages/UserDropdown";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showOrdersMenu, setShowOrdersMenu] = useState(false);

  const { userType, logout } = useAuth();
  const navigate = useNavigate();
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
        <Link to="/home" className="nav-logo">
          <img
            className="logo-img"
            src="/logo/nlogo_transparent.png"
            alt="My Image"
          />
        </Link>

        <div className={`nav-menu ${mobileMenuOpen ? "active" : ""}`}>
          {/* -------------------- الضيف -------------------- */}
          {userType === "guest" && (
            <>
              <Link to="/servicespage" className="nav-link" onClick={toggleMobileMenu}>
                الخدمات
              </Link>
              <Link to="/about" className="nav-link" onClick={toggleMobileMenu}>
                من نحن
              </Link>
              <Link to="/contact" className="nav-link" onClick={toggleMobileMenu}>
                تواصل معنا
              </Link>
              <Link to="/login" className="nav-link" onClick={toggleMobileMenu}>
                تسجيل الدخول
              </Link>
              <Link to="/register" className="nav-link" onClick={toggleMobileMenu}>
                إنشاء حساب
              </Link>
            </>
          )}

          {/* -------------------- الخدمات لجميع المستخدمين المسجلين -------------------- */}
          {userType !== "guest" && (
            <Link
              to="/servicespage"
              className="nav-link"
              onClick={toggleMobileMenu}
            >
              الخدمات
            </Link>
          )}
          {userType !== "guest" && (
            <div
              className="nav-link orders-dropdown"
              onMouseEnter={() => setShowOrdersMenu(true)}
              onMouseLeave={() => setShowOrdersMenu(false)}
              onClick={() => setShowOrdersMenu(!showOrdersMenu)}
            >
              طلباتي
              {showOrdersMenu && (
                <ul className="orders-dropdown-menu">
                  <li>
                    <Link to="/orders-not-approved" className="nav-link" onClick={() => { setShowOrdersMenu(false); toggleMobileMenu(); }}>
                      طلبات لم يتم الموافقة عليها
                    </Link>
                  </li>
                  <li>
                    <Link to="/on-progress-orders" className="nav-link" onClick={() => { setShowOrdersMenu(false); toggleMobileMenu(); }}>
                      الطلبات جاري العمل عليها للطالب
                    </Link>
                  </li>
                  <li>
                    <Link to="/student-completed-orders" className="nav-link" onClick={() => { setShowOrdersMenu(false); toggleMobileMenu(); }}>
                      طلبات مكتملة
                    </Link>
                  </li>
                </ul>
              )}
            </div>
          )}

          {/* -------------------- الطالب -------------------- */}
          {userType === "STUDENT" && (
            <>
              <Link
                to="/student-dashboard"
                className="nav-link"
                onClick={toggleMobileMenu}
              >
                لوحة التحكم{" "}
              </Link>
              <Link
                to="/orders-inbox"
                className="nav-link"
                onClick={toggleMobileMenu}
              >
                الطلبات الواردة
              </Link>
              <Link
                to="/add-request"
                className="nav-link"
                onClick={toggleMobileMenu}
              >
                إضافة طلب
              </Link>
             
              <span
                className="nav-link"
                onClick={() => {
                  logout();
                  toggleMobileMenu();
                  navigate("/");
                }}
              >
                تسجيل الخروج
              </span>
              <UserDropdown profilePath="/card-info" />
            </>
          )}

          {/* -------------------- يوزر عادي -------------------- */}
          {userType === "USER" && (
            <>
              <Link
                to="/add-request"
                className="nav-link"
                onClick={toggleMobileMenu}
              >
                إضافة طلب
              </Link>
              {/* روابط عامة تظهر لمستخدم عادي */}
              <Link
                to="/about"
                className="nav-link"
                onClick={toggleMobileMenu}
              >
                من نحن
              </Link>
              <Link
                to="/contact"
                className="nav-link"
                onClick={toggleMobileMenu}
              >
                اتصل بنا
              </Link>
              <span
                className="nav-link"
                onClick={() => {
                  logout();
                  toggleMobileMenu();
                  navigate("/");
                }}
              >
                تسجيل الخروج
              </span>
              {/* عرض Dropdown للمستخدم */}
              <UserDropdown profilePath="/profile" />
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
