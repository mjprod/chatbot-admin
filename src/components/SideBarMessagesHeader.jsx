import { useState } from "react";
import "./SideBarMessagesHeader.css"; // Import the CSS file
import { ReactComponent as IconSearch} from '../assets/iconSearch.svg';
import { ReactComponent as IconDownChevron} from '../assets/iconChevronRight.svg';
import { ReactComponent as IconSort} from '../assets/iconSort.svg';


const SideBarMessagesHeader = ({
  setSortOrder,
  setSortHold,
  setFilterText,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Newest');
  const [searchText, setSearchText] = useState('');

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setShowDropdown(false);

    if (option === 'Controlled') {
      setSortHold(true);
    } else {
      setSortHold(false);
    }
    setSortOrder(option ? option.toLowerCase() : 'newest');
  };

  const handleInputChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleSearch = () => {
    setFilterText(searchText);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className='header-container'>
      <h1 className='header-title'>Messages</h1>
      <div className='header-controls'>
        <div className='search-container'>
          <input
            type='text'
            className='search-input'
            placeholder='Member Code ...'
            value={searchText}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
          />
          <button className="search-button" onClick={handleSearch}>
            <span role="img" aria-label="search">
              <IconSearch className="icon-search" />
            </span>
          </button>
        </div>
        <div className="sort-container">
          <button className="sort-button" onClick={toggleDropdown}>
           <IconSort/> {selectedOption} <span><IconDownChevron className="icon-arrow" /></span>
          </button>
          {showDropdown && (
            <div className='sort-dropdown'>
              <ul>
                {['Newest', 'Oldest', 'Controlled'].map((option) => (
                  <li key={option} onClick={() => handleOptionSelect(option)}>
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
