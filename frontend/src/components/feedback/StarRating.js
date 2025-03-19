// StarRating.js
import React from 'react';
import './StarRating.css'; // Import CSS for styling

const StarRating = ({ rating, onRatingChange }) => {
  const handleMouseEnter = (star) => {
    document.querySelectorAll('.star').forEach((starElement, index) => {
      if (index < star) {
        starElement.classList.add('hover');
      } else {
        starElement.classList.remove('hover');
      }
    });
  };

  const handleMouseLeave = () => {
    document.querySelectorAll('.star').forEach((starElement) => {
      starElement.classList.remove('hover');
    });
  };

  const handleClick = (newRating) => {
    onRatingChange(newRating);
  };

  return (
    <div
      className="star-rating"
      onMouseLeave={handleMouseLeave}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${rating >= star ? 'filled' : ''}`}
          onMouseEnter={() => handleMouseEnter(star)}
          onClick={() => handleClick(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
