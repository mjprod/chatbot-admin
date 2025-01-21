import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Rating.css'; // Optional CSS for styling

const Rating = ({ maxRating = 6, initialRating = 0, onRatingChange }) => {
  const [hoveredRating, setHoveredRating] = useState(null);
  const [selectedRating, setSelectedRating] = useState(initialRating);

  // Handle when a user hovers over a rating
  const handleMouseEnter = (index) => setHoveredRating(index);

  // Handle when the hover is removed
  const handleMouseLeave = () => setHoveredRating(null);

  // Handle the click to select a rating
  const handleClick = (index) => {
    setSelectedRating(index);
    onRatingChange(index); // Notify parent component of rating change
  };

  const renderStars = () => {
    return Array.from({ length: maxRating }, (_, index) => {
      const ratingValue = index + 1;
      const isFilled = ratingValue <= (hoveredRating || selectedRating);

      return (
        <span
          key={index}
          className={`star ${isFilled ? 'filled' : ''}`}
          onMouseEnter={() => handleMouseEnter(ratingValue)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(ratingValue)}
        >
          ★
        </span>
      );
    });
  };

  return <div className="rating-container">{renderStars()}</div>;
};

Rating.propTypes = {
  maxRating: PropTypes.number, // Maximum number of stars
  initialRating: PropTypes.number, // Initial rating value
  onRatingChange: PropTypes.func, // Callback for when rating changes
};

export default Rating;
