import { ThumbsUp, MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { likeReview, unlikeReview } from '../services/requests';

interface ReviewItem {
  Reviews: {
    id: number;
    userId: string;
    bookId: string;
    reviewDesc: string;
    starRating: number;
    likeCount: number;
    createdAt: string;
  };
  Users: {
    userId: string;
    email: string;
    displayName: string;
    insertedAt?: string;
  };
}

interface ReviewListProps {
  reviews: ReviewItem[];
  className?: string;
}

export default function ReviewList({ reviews, className = "" }: ReviewListProps) {
  const [reviewsState, setReviewsState] = useState(reviews);
  const [likedReviews, setLikedReviews] = useState<Set<number>>(new Set());

  useEffect(() => {
    setReviewsState(reviews);
  }, [reviews]);

  const handleLike = async (reviewId: number) => {
    const isCurrentlyLiked = likedReviews.has(reviewId);

    // Optimistic update
    setLikedReviews(prev => {
      const newSet = new Set(prev);
      if (isCurrentlyLiked) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });

    setReviewsState(prev =>
      prev.map(item => {
        if (item.Reviews.id === reviewId) {
          return {
            ...item,
            Reviews: {
              ...item.Reviews,
              likeCount: isCurrentlyLiked
                ? item.Reviews.likeCount - 1
                : item.Reviews.likeCount + 1,
            },
          };
        }
        return item;
      })
    );

    try {
      if (isCurrentlyLiked) {
        await unlikeReview(reviewId);
      } else {
        await likeReview(reviewId);
      }
    } catch (error) {
      // Revert on error
      console.error("Failed to like review", error);
      setLikedReviews(prev => {
        const newSet = new Set(prev);
        if (isCurrentlyLiked) {
          newSet.add(reviewId);
        } else {
          newSet.delete(reviewId);
        }
        return newSet;
      });
      setReviewsState(prev =>
        prev.map(item => {
          if (item.Reviews.id === reviewId) {
            return {
              ...item,
              Reviews: {
                ...item.Reviews,
                likeCount: isCurrentlyLiked
                  ? item.Reviews.likeCount + 1
                  : item.Reviews.likeCount - 1,
              },
            };
          }
          return item;
        })
      );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 bg-white rounded-2xl border border-gray-100">
        No reviews yet. Be the first to share your thoughts!
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className} max-h-[70vh] overflow-y-auto p-2 shadow-inner rounded-2xl`}>
      {reviewsState.map((item) => {
        const { Reviews, Users } = item;
        const displayName = Users.displayName || "Anonymous";
        const avatarUrl = `https://i.pravatar.cc/150?u=${Users.userId}`;

        return (
          <div
            key={Reviews.id}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
          >
            {/* Header */}
            <div className="flex items-center gap-4">
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-gray-100"
              />

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 font-Buda">{displayName}</h3>

                  {/* Star Rating */}
                  <div className="flex text-light-accent text-2xl">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>
                        {i < Reviews.starRating ? '★' : '☆'}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-gray-500 font-Oxanium">
                  {formatDate(Reviews.createdAt)}
                </p>
              </div>
            </div>

            {/* Review Text */}
            <div className="mt-5 text-gray-700 leading-relaxed font-Tilt_Neon">
              {Reviews.reviewDesc}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">
              <button
                onClick={() => handleLike(Reviews.id)}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${likedReviews.has(Reviews.id)
                  ? 'text-light-accent'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                <ThumbsUp
                  size={18}
                  className={likedReviews.has(Reviews.id) ? 'fill-current' : ''}
                />
                <span>{Reviews.likeCount}</span>
              </button>

              {/* <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
                <MessageCircle size={18} />
                <span>0</span>
              </button> */}
            </div>
          </div>
        );
      })}
    </div>
  );
}