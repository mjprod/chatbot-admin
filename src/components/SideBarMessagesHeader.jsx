import { useState } from "react";
import "./SideBarMessagesHeader.css"; // Import the CSS file

const SideBarMessagesHeader = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Sort By");

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option); // Update selected option
    setShowDropdown(false); // Close the dropdown
  };

  return (
    <div className="header-container">
      <h1 className="header-title">Messages</h1>
      <div className="header-controls">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Member Code ..."
          />
          <button className="search-button">
            <span role="img" aria-label="search">
              🔍
            </span>
          </button>
        </div>
        <div className="sort-container">
          <button className="sort-button" onClick={toggleDropdown}>
            {selectedOption} <span className="arrow">▼</span>
          </button>
          {showDropdown && (
            <div className="sort-dropdown">
              <ul>
                {["Default", "Newest", "Oldest", "Controlled"].map((option) => (
                  <li
                    key={option}
                    onClick={() => handleOptionSelect(option)} // Handle option click
                  >
                    {option}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SideBarMessagesHeader;