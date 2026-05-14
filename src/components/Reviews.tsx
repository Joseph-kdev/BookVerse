import { Plus, X } from "lucide-react"
import React, { useState } from "react"
import { useUserAuthContext } from "../config/UserAuthContext"
import toast from "react-hot-toast";
import { getReviews, postReview } from "../services/requests";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ReviewList from "./ReviewList";

export interface Review {
    userId: string;
    bookId: string;
    reviewDesc: string;
    starRating: number;
}

const MAX_REVIEW_LENGTH = 1000;



function ReviewDialog({ setShowDialog, submitReview }: { setShowDialog: React.Dispatch<React.SetStateAction<boolean>>; submitReview: (starRating: number, description: string) => Promise<unknown> }) {
    const [rating, setRating] = useState(1)
    const [description, setDescription] = useState("")

    return (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">

            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-zinc-100">
                <div>
                    <h2 className="text-xl font-semibold text-zinc-900 font-Buda">Write a Review</h2>
                    <p className="text-zinc-500 text-xs mt-1">Share your thoughts about this book with other readers.</p>
                </div>
                <button onClick={() => setShowDialog(false)} className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-zinc-600 transition-colors">
                    <X size={24} />
                </button>
            </div>

            <div className="p-6 space-y-8">
                <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-3">Your Rating</label>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => setRating(star)}
                                className="text-4xl transition-transform hover:scale-110"
                            >
                                {star <= rating ? (
                                    <span className="text-yellow-400">★</span>
                                ) : (
                                    <span className="text-zinc-300">☆</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">Your Review</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={6}
                        maxLength={MAX_REVIEW_LENGTH}
                        className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:border-light-secondary resize-y min-h-[140px] font-Oxanium text-sm"
                        placeholder="What did you think about this book? Share your thoughts, favorite moments, or what you learned..."
                    />
                    <div className={`text-right text-xs mt-1 font-Oxanium ${description.length >= MAX_REVIEW_LENGTH ? 'text-red-500' : 'text-zinc-400'}`}>
                        {description.length} / {MAX_REVIEW_LENGTH}
                    </div>
                </div>
            </div>

            <div className="px-6 py-5 border-t border-zinc-100 flex items-center gap-3">
                <button onClick={() => setShowDialog(false)}
                    className="flex-1 py-3 text-sm font-medium border border-zinc-300 rounded-xl hover:bg-zinc-50 transition-colors">
                    Cancel
                </button>
                <button onClick={() => submitReview(rating, description)}
                    id="submit-btn"
                    className="flex-1 py-3 text-sm font-medium bg-light-accent text-light-text rounded-xl hover:bg-light-accent/80 transition-colors disabled:bg-zinc-300">
                    Submit Review
                </button>
            </div>
        </div>
    )
}


export default function Reviews({ bookId }: { bookId: string }) {
    const [showDialog, setShowDialog] = useState(false)
    const { user } = useUserAuthContext()
    const queryClient = useQueryClient()

    const noUserPopUp = () => {
        toast.error('You have to login to add a review', {
            duration: 2000,
            position: "top-center",
            icon: "❌",
            className: "text-sm text-light-text",
        })
    }

    const submitReview = async (starRating: number, description: string) => {
        if (starRating === 0) {
            toast.error("Rating cannot be zero", {
                duration: 2000,
                position: "top-center",
                icon: "❌",
                className: "text-sm text-light-text",
            })
            return
        }

        if (description === "") {
            toast.error("Review cannot be empty", {
                duration: 2000,
                position: "top-center",
                icon: "❌",
                className: "text-sm text-light-text",
            })
            return
        }

        if (description.length > MAX_REVIEW_LENGTH) {
            toast.error(`Review is too long (max ${MAX_REVIEW_LENGTH} characters)`, {
                duration: 2000,
                position: "top-center",
                icon: "❌",
                className: "text-sm text-light-text",
            })
            return
        }

        const review: Review = {
            userId: user?.uid as string,
            bookId: bookId,
            starRating: starRating,
            reviewDesc: description
        }

        try {
            const response = await postReview(review)
            toast.success("Review added", {
                duration: 2000,
                position: "top-center",
                icon: "✅",
                className: "text-sm text-light-text",
            })
            setShowDialog(false)
            queryClient.invalidateQueries({ queryKey: [`reviews-${bookId}`] })
            return response
        } catch (error) {
            console.log("Error adding review", error)
            toast.error('Error adding review')
        }
    }

    const {
        data: reviews = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: [`reviews-${bookId}`],
        queryFn: () => getReviews(bookId),
    });

    return (
        <div className="">
            {showDialog && user?.uid && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <ReviewDialog setShowDialog={setShowDialog} submitReview={submitReview} />
                </div>
            )}
            <div className="flex justify-between items-center my-2">
                <p className="my-2 font-Tilt_Neon text-lg">
                    Reviews
                </p>
                <button className="flex items-center gap-1 bg-light-secondary text-gray-100 text-sm p-2 rounded-lg" onClick={() => user ? setShowDialog(true) : noUserPopUp()}>
                    <Plus size={16} className="" />
                    <p className="">
                        Write a Review
                    </p>
                </button>
            </div>
            <div>
                {isLoading ? (
                    <div className="text-center py-12 text-gray-500">Loading reviews...</div>
                ) : isError ? (
                    <div className="text-center py-12 text-gray-500">Error loading reviews</div>
                ) : (
                    <ReviewList reviews={reviews} />
                )}
            </div>
        </div>
    )
}
