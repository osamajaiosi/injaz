import React from "react";
import PropTypes from "prop-types";
import SidebarProfile from "./SidebarProfile";
import NavMenuItem from "./NavMenuItem";

const DashboardSidebar = ({
  activeTab,
  setActiveTab,
  openDropdown,
  toggleDropdown,
}) => {
  const isTabActive = (tabPrefix) => {
    return typeof tabPrefix === "string"
      ? activeTab.startsWith(tabPrefix)
      : activeTab === tabPrefix;
  };

  const selectFirstDropdownItem = (itemId) => {
    const menuItem = menuItems.find((item) => item.id === itemId);
    if (menuItem && menuItem.subItems && menuItem.subItems.length > 0) {
      setActiveTab(menuItem.subItems[0].id);
      toggleDropdown(itemId);
    }
  };

  // Menu item definitions
  const menuItems = [
    {
      id: "services",
      label: "خدماتي",
      icon: "fa-book",
      isDropdown: true,
      subItems: [
        { id: "services-add", label: "إضافة خدمة" },
        { id: "services-edit", label: "تعديل خدمة" },
        { id: "services-delete", label: "حذف خدمة" },
        { id: "services-view", label: "عرض خدمة" },
      ],
    },
    {
      id: "request",
      label: "طلباتي",
      icon: "fa-tasks",
      isDropdown: true,
      subItems: [
        { id: "underworking", label: "جاري العمل عليها" },
        { id: "completed", label: "مكتمل" },
        { id: "cancelled", label: "ملغية" },
      ],
    },
    {
      id: "cards",
      label: "بطاقاتي",
      icon: "fa-id-card",
      isDropdown: false,
    },
    {
      id: "sales",
      label: "مبيعاتي",
      icon: "fa-chart-line",
      isDropdown: true,
      subItems: [
        { id: "sales-diagnostics", label: "تشخيصات و مراجعات" },
        { id: "sales-stats", label: "إحصائيات" },
      ],
    },
  ];

  return (
    <div className="dashboard-sidebar">
      <SidebarProfile />

      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => (
            <NavMenuItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              isDropdown={item.isDropdown}
              isActive={isTabActive(item.id)}
              isOpen={openDropdown === item.id}
              onClick={
                item.isDropdown
                  ? () => toggleDropdown(item.id)
                  : () => setActiveTab(item.id)
              }
              onFirstItemSelect={selectFirstDropdownItem}
              firstItemId={item.id}
              activeTab={activeTab}
            >
              {item.isDropdown && (
                <ul>
                  {item.subItems.map((subItem) => (
                    <li
                      key={subItem.id}
                      onClick={() => setActiveTab(subItem.id)}
                      className={
                       "subitem" + activeTab === subItem.id ? "active-subitem" : ""
                      }
                    >
                      {subItem.label}
                    </li>
                  ))}
                </ul>
              )}
            </NavMenuItem>
          ))}
        </ul>
      </nav>
    </div>
  );
};
DashboardSidebar.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  openDropdown: PropTypes.string,
  toggleDropdown: PropTypes.func.isRequired,
};

export default DashboardSidebar;
