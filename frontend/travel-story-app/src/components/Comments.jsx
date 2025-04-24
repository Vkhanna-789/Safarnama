import { useEffect, useState } from "react";

const Comments = ({ storyId }) => {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        if (!storyId) return;
    
        fetch(`http://localhost:8000/stories/${storyId}/comments`)
            .then((res) => res.json())
            .then((data) => {
                console.log("Fetched comments:", data); // Debugging output
                setComments(data);
            })
            .catch((err) => console.error("Error fetching comments:", err));
    }, [storyId]);
    
    return (
        <div className="max-w-lg w-full bg-white shadow-md rounded-lg p-4 mt-4">
            <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">💬 Comments</h2>

            {comments.length > 0 ? (
                <div className="space-y-4 mt-3">
                    {comments.map((comment, index) => (
                        <div key={index} className="p-3 border rounded-lg bg-gray-100 shadow-sm">
                            {/* Comment User Info */}
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full text-sm font-semibold">
                                    {comment?.userId?.fullName?.charAt(0).toUpperCase() || "U"}
                                </div>
                                <h4 className="text-sm font-semibold text-blue-600">
                                    {comment?.userId?.fullName || "Unknown User"}
                                </h4>
                            </div>

                            {/* Comment Text */}
                            <p className="text-gray-700 mt-1">{comment.commentText}</p>

                            {/* Comment Date */}
                            <span className="text-xs text-gray-500 block mt-1">
                                {new Date(comment.createdOn).toLocaleDateString()}
                            </span>

                            {/* Story Owner Info */}
                            {comment.postOwner && (
                                <div className="text-xs text-gray-600 mt-2">
                                    🏠 <strong>Story by:</strong> {comment.postOwner.fullName || "Unknown"}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 text-center mt-3">No comments yet. Be the first to comment!</p>
            )}
        </div>
    );
};

export default Comments;
    
