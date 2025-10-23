import React from 'react';

interface ReviewCardProps {
  name: string;
  role: string;
  review: string;
  rating: number;
  image: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ name, role, review, image }) => {
  return (
    <div className="bg-white text-sm p-6 rounded-xl shadow-md flex flex-col w-[340px] hover:shadow-2xl">
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
    
      <p className="text-gray-600 italic">{review}</p>
    </div>
  );
};

export default ReviewCard;