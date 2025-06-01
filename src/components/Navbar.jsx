import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import "./Navbar.css";
import UserDropdown from "../pages/UserDropdown";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showOrdersMenu, setShowOrdersMenu] = useState(false);

  const { userType, idStudent } = useAuth();
  const [hasUnread, setHasUnread] = useState(false);
  console.log(userType); // لرؤية قيمة userType في الكونسول

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (userType === 'STUDENT' && idStudent) {
      axios.get(
        `http://eallaenjazapi.runasp.net/api/Request_Order/GET_LIST_ID_REQUEST_ORDER_BY_ID_STUDENT${idStudent}`
      )
      .then(res => {
        const ids = res.data || [];
        const clicked = JSON.parse(localStorage.getItem('clickedOrders')) || [];
        setHasUnread(ids.some(id => !clicked.includes(id)));
      })
      .catch(() => {});
    }
  }, [userType, idStudent]);

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
                <i className="fas fa-paint-brush"></i> تصفح الخدمات
              </Link>
              <Link to="/about" className="nav-link" onClick={toggleMobileMenu}>
                <i className="fas fa-info-circle"></i> من نحن
              </Link>
              <Link to="/contact" className="nav-link" onClick={toggleMobileMenu}>
                <i className="fas fa-envelope"></i> تواصل معنا
              </Link>
              <Link to="/login" className="nav-link" onClick={toggleMobileMenu}>
                <i className="fas fa-sign-in-alt"></i> الدخول
              </Link>
              <Link to="/register" className="nav-link" onClick={toggleMobileMenu}>
                <i className="fas fa-user-plus"></i> إنشاء
              </Link>
            </>
          )}

          {/* -------------------- الخدمات لجميع المستخدمين المسجلين -------------------- */}
          {userType !== "guest" && (
            <Link to="/servicespage" className="nav-link" onClick={toggleMobileMenu}>
              <i className="fas fa-paint-brush"></i> تصفح الخدمات
            </Link>
          )}
          {userType !== "guest" && (
            <div
              className="nav-link orders-dropdown"
              onMouseEnter={() => setShowOrdersMenu(true)}
              onMouseLeave={() => setShowOrdersMenu(false)}
              onClick={() => setShowOrdersMenu(!showOrdersMenu)}
            >
              <i className="fas fa-list"></i> طلباتي
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
              <Link to="/student-dashboard" className="nav-link" onClick={toggleMobileMenu}>
                <i className="fas fa-th-large"></i> لوحة التحكم
              </Link>
              <Link to="/orders-inbox" className="nav-link" onClick={toggleMobileMenu}>
                <i className="fas fa-inbox"></i> الطلبات الواردة {hasUnread && <span className="unread-dot" />}
              </Link>
              <Link to="/add-request" className="nav-link" onClick={toggleMobileMenu}>
                <i className="fas fa-plus-circle"></i> إضافة طلب
              </Link>
              <UserDropdown profilePath="/card-info" />
            </>
          )}

          {/* -------------------- يوزر عادي -------------------- */}
          {userType === "USER" && (
            <>
              <Link to="/add-request" className="nav-link" onClick={toggleMobileMenu}>
                <i className="fas fa-plus-circle"></i> إضافة طلب
              </Link>
              <Link to="/contact" className="nav-link" onClick={toggleMobileMenu}>
                <i className="fas fa-envelope"></i> اتصل بنا
              </Link>
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
