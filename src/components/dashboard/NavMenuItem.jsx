import React, { useState, useEffect } from "react";
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

  // Keep dropdown open if any of its children is selected
  const isChildActive =
    isDropdown && activeTab && activeTab.startsWith(firstItemId);

  // Handle main button click
  const handleClick = (e) => {
    if (isDropdown && firstItemId) {
      // If it's a dropdown, select the first item
      onFirstItemSelect(firstItemId);
    } else {
      // Otherwise use the normal onClick handler
      onClick(e);
    }
  };

  // Show dropdown on hover
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Determine if dropdown should be shown (on hover, if explicitly open, or if a child is active)
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

export default NavMenuItem;
