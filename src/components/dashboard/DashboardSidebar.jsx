import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import "./DashboardSidebar.css";

const DashboardSidebar = ({ activeTab, setActiveTab, userData }) => {
  return (
    <div className="dashboard-sidebar">
      <div className="sidebar-header">
        <div className="user-avatar">
          <img src={userData?.avatar || "/avatar/avatar.png"} alt="صورة المستخدم" />
        </div>
        <h3>مرحبا، {userData?.name?.split(" ")[0] || "أحمد"}</h3>
        <span className="user-role">طالب</span>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          <li className={activeTab === "dashboard" ? "active" : ""}>
            <button onClick={() => setActiveTab("dashboard")}>
              <i className="fas fa-home"></i>
              <span>لوحة التحكم</span>
            </button>
          </li>
          <li className={activeTab === "services" ? "active" : ""}>
            <button onClick={() => setActiveTab("services")}>
              <i className="fas fa-book"></i>
              <span>خدماتي</span>
            </button>
          </li>
          <li className={activeTab === "requests" ? "active" : ""}>
            <button onClick={() => setActiveTab("requests")}>
              <i className="fas fa-tasks"></i>
              <span>الطلبات</span>
            </button>
          </li>
          <li className={activeTab === "messages" ? "active" : ""}>
            <button onClick={() => setActiveTab("messages")}>
              <i className="fas fa-envelope"></i>
              <span>الرسائل</span>
            </button>
          </li>
          <li>
            <Link to="/student-profile" className="sidebar-profile-link">
              <i className="fas fa-user"></i>
              <span>الملف الشخصي</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

DashboardSidebar.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  userData: PropTypes.object
};

export default DashboardSidebar;