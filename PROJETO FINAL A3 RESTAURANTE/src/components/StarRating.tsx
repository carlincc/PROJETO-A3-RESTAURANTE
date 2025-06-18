
import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  size = 16,
  interactive = false,
  onRatingChange
}) => {
  const handleStarClick = (starIndex: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(starIndex + 1);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: maxStars }, (_, index) => (
        <Star
          key={index}
          size={size}
          className={`${
            index < rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-300'
          } ${
            interactive ? 'cursor-pointer hover:text-yellow-400' : ''
          }`}
          onClick={() => handleStarClick(index)}
        />
      ))}
    </div>
  );
};

export default StarRating;
