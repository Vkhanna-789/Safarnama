import { useState } from "react";

const AddComment = ({ storyId, userId, onCommentAdded }) => {
    const [commentText, setCommentText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const storedUserId = localStorage.getItem("userId");
    const finalUserId = userId || storedUserId; // Ensure userId is available

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(null);

        console.log("User ID:", finalUserId);
        console.log("Story ID:", storyId);

        if (!finalUserId) {
            setErrorMessage("❌ User ID is missing. Please log in.");
            return;
        }

        if (!storyId) {
            setErrorMessage("❌ Story ID is missing.");
            return;
        }

        if (!commentText.trim()) {
            setErrorMessage("❌ Comment cannot be empty.");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`http://localhost:8000/stories/${storyId}/comments`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ userId: finalUserId, commentText }),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem("token");
                    setErrorMessage("❌ Session expired. Please log in again.");
                    return;
                }
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to add comment.");
            }

            setCommentText(""); // Clear input field
            alert("✅ Comment added successfully!");

            if (typeof onCommentAdded === "function") {
                onCommentAdded(); // Refresh comments
            }
        } catch (error) {
            console.error("❌ Network or API error:", error);
            setErrorMessage("❌ Unable to post comment. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
                <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    required
                    disabled={isSubmitting}
                    className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200"
                />

                {errorMessage && (
                    <p className="text-red-500 text-sm" aria-live="polite">{errorMessage}</p>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-4 py-2 text-white rounded-md transition ${
                        isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                    {isSubmitting ? "Posting..." : "Post Comment"}
                </button>
            </form>
        </div>
    );
};

export default AddComment;
