import React from 'react';
import { Star } from 'lucide-react';

interface ReviewCardProps {
  name: string;
  role: string;
  review: string;
  rating: number;
  image: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ name, role, review, rating, image }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md flex flex-col">
      <div className="flex items-center mb-4">
        <img
          src={image}
          alt={`${name}'s profile`}
          className="w-12 h-12 rounded-full object-cover mr-4"
        />
        <div>
          <h4 className="font-semibold text-navy-900">{name}</h4>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
      
      <div className="flex mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
      
      <p className="text-gray-600 italic">{review}</p>
    </div>
  );
};

export default ReviewCard;