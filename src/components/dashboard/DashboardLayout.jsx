import DashboardSidebar from "./DashboardSidebar";

const DashboardLayout = ({
  children,
  activeTab,
  setActiveTab,
  openDropdown,
  toggleDropdown,
}) => {
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
