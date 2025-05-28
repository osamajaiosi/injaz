import PropTypes from "prop-types";
import SidebarProfile from "./SidebarProfile";
import NavMenuItem from "./NavMenuItem";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";

const DashboardSidebar = ({
  activeTab,
  setActiveTab,
  openDropdown,
  toggleDropdown,
}) => {
  const navigate = useNavigate();
  const { idStudent: studentId } = useAuth();

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

        { id: "orders-inbox", label: "الطلبات الواردة" },
        { id: "orders-completed", label: "الطلبات المكتملة" }, // مضافة
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
        { id: "sales-diagnostics", label: "التقييم والمراجعات" },
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
              onClick={() => {
                if (item.isDropdown) {
                  selectFirstDropdownItem(item.id);
                } else {
                  setActiveTab(item.id);
                  toggleDropdown("");
                  if (item.id === "cards") {
                    navigate("/card-info");
                  }
                }
              }}
              onFirstItemSelect={selectFirstDropdownItem}
              firstItemId={item.id}
              activeTab={activeTab}
            >
              {item.isDropdown && (
                <ul>
                  {item.subItems.map((subItem) => (
                    <li
                      key={subItem.id}
                      onClick={() => {
                        setActiveTab(subItem.id);

                        // التوجيه للصفحات حسب المعرف
                        if (subItem.id === "services-add") {
                          navigate("/AddService");
                        } else if (subItem.id === "services-edit") {
                          navigate(`/update-service/${studentId}`);
                        } else if (subItem.id === "services-delete") {
                          navigate(`/delete-service/${studentId}`);
                        } else if (subItem.id === "services-view") {
                          navigate(`/dashboard/custom-show-info/${studentId}`);
                        } else if (subItem.id === "underworking") {
                          navigate("/on-progress");
                        } else if (subItem.id === "orders-inbox") {
                          navigate("/orders-inbox");
                        } else if (subItem.id === "orders-completed") {
                          navigate("/completed-orders");
                        } else if (subItem.id === "cards") {
                          navigate("/show-info/2");
                        } else if (subItem.id === "sales-diagnostics") {
                          navigate("/sales-diagnostics");
                        } else if (subItem.id === "sales-stats") {
                          navigate("/sales-stats");
                        }
                      }}
                      className={`subitem ${
                        activeTab === subItem.id ? "active-subitem" : ""
                      }`}
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
