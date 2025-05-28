import { useState } from "react";
import { useAuth } from "../Contexts/AuthContext";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import DashboardContent from "../components/dashboard/DashboardContent";
import "./StudentDashboard.css";

function StudentDashboard() {
  const { userType } = useAuth();
  const [activeTab, setActiveTab] = useState("services");
  const [openDropdown, setOpenDropdown] = useState(null);

  // Redirect if not a student
  if (userType !== "STUDENT") {
    return (
      <div className="unauthorized-message">
        <h2>غير مصرح بالوصول</h2>
        <p>هذه الصفحة متاحة فقط للطلاب</p>
      </div>
    );
  }

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <div className="student-dashboard">
      <DashboardSidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openDropdown={openDropdown}
        toggleDropdown={toggleDropdown}
      />
      <DashboardContent activeTab={activeTab} />
    </div>
  );
}

export default StudentDashboard;
