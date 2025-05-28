import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./UserDropdown.css";
import { useAuth } from "../Contexts/AuthContext";

const UserDropdown = ({ profilePath = "/profile" }) => {
  const { userType } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className="ud-container"
      onMouseEnter={() => setShowMenu(true)}
      onMouseLeave={() => setShowMenu(false)}
    >
      {/* أيقونة المستخدم ⟶ تربط بالبروفايل فقط */}
      <img
        className="ud-avatar"
        src="/avatar/avatar.png"
        alt="الملف الشخصي"
        onClick={() => navigate(userType === "STUDENT" ? "/profile" : profilePath)}
      />

      {/* القائمة المنسدلة */}
      {showMenu && (
        <ul className="ud-dropdown">
          <li className="ud-item">
            <Link to={profilePath} className="ud-link">
              {userType === "USER" ? "عرض ملفي الشخصي" : "عرض معلومات بطاقتي"}
            </Link>
          </li>

          <li className="ud-item">
            <Link to="/change-password" className="ud-link">
              تغيير كلمة المرور
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default UserDropdown;
