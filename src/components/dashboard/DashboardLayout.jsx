import { useState } from "react";
import DashboardSidebar from "./DashboardSidebar";

const DashboardLayout = ({
  children,
  activeTab: initialTab,
  openDropdown: initialDropdown,
}) => {
  const [activeTab, setActiveTab] = useState(initialTab || "");
  const [openDropdown, setOpenDropdown] = useState(initialDropdown || "");

  const toggleDropdown = (id) => {
    setOpenDropdown((prev) => (prev === id ? "" : id));
  };

  return (
    <div className="dashboard-layout" style={{ display: "flex" }}>
      <DashboardSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openDropdown={openDropdown}
        toggleDropdown={toggleDropdown}
      />
      <div className="dashboard-content" style={{ flex: 1, padding: "20px" }}>
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
