import { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { languages } from '../data/arrays';

const FiltersConversation = ({ filters, onLanguageSelect }) => {
  const { i18n } = useTranslation();

  const [selectedLanguage, setSelectedLanguage] = useState(filters);

  useEffect(() => {
    setSelectedLanguage(filters);
  }, [filters]);

  const handleLanguageChange = (e) => {
    const selected = e.target.value;
    setSelectedLanguage(selected);
    onLanguageSelect(selected);
    i18n.changeLanguage(selected);
  };

  return (
    <div
      style={{
        padding: '10px',
        backgroundColor: '#f8f8f8',
        borderBottom: '1px solid #ddd',
      }}
    >
      <label
        htmlFor="language-selector"
        style={{ fontWeight: 'bold', marginRight: '10px' }}
      >
        Select Language:
      </label>
      <select
        id="language-selector"
        value={selectedLanguage}
        onChange={handleLanguageChange}
        style={{ padding: '5px', fontSize: '16px' }}
      >
        <option value="">-- Choose Language --</option>
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
};
FiltersConversation.propTypes = {
  filters: PropTypes.string.isRequired,
  onLanguageSelect: PropTypes.func.isRequired,
};

export default FiltersConversation;
