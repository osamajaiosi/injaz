import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./Dashboard.css";

const NavMenuItem = ({
  icon,
  label,
  isDropdown,
  isActive,
  onClick,
  isOpen,
  children,
  onFirstItemSelect,
  firstItemId,
  activeTab,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const isChildActive =
    isDropdown && activeTab && activeTab.startsWith(firstItemId);

  const handleClick = (e) => {
    if (isDropdown && firstItemId) {
      onFirstItemSelect(firstItemId);
    } else {
      onClick(e);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const showDropdown = isDropdown && (isHovered || isOpen || isChildActive);

  return (
    <li
      className={`${isDropdown ? "dropdown" : ""} ${isActive ? "active" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button onClick={handleClick} className={isActive ? "active-tab" : ""}>
        <i className={`fas ${icon}`}></i>
        <span>{label}</span>
        {isDropdown && (
          <i
            className={`dropdown-arrow fas fa-chevron-${
              showDropdown ? "up" : "down"
            }`}
          ></i>
        )}
      </button>
      {showDropdown && isDropdown && (
        <div className="dropdown-menu">{children}</div>
      )}
    </li>
  );
};

// ✅ Add PropTypes validation
NavMenuItem.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  isDropdown: PropTypes.bool,
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
  isOpen: PropTypes.bool,
  children: PropTypes.node,
  onFirstItemSelect: PropTypes.func,
  firstItemId: PropTypes.string,
  activeTab: PropTypes.string,
};

export default NavMenuItem;
