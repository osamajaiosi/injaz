//import React from "react";

const SidebarProfile = ({ userName = "أحمد", userRole = "طالب" }) => {
  return (
    <div className="sidebar-header">
      <div className="user-avatar">
        <img src="/avatar/avatar.png" alt="صورة المستخدم" />
      </div>
      <h3>مرحبا، {userName}</h3>
      <span className="user-role">{userRole}</span>
    </div>
  );
};

export default SidebarProfile;
