import { Button, Textarea } from "flowbite-react";
import moment from "moment/moment";
import { useEffect, useState } from "react";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";

export default function Comment({ comment, onLike, onSave, onDelete }) {
    const { currentUser } = useSelector((state) => state.user);
    const [user, setUser] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [editedComment, setEditedComment] = useState(comment.content);

    useEffect(() => {
        // console.log(comment);
        try {
            const fetchUser = async () => {
                // console.log(comment.userId);
                const res = await fetch(`/api/user/${comment.userId}`);
                const fetchedUser = await res.json();

                if (res.ok) {
                    setUser(fetchedUser);
                    // console.log(fetchedUser);
                    // console.log("user  ",user);
                } else {
                    console.log(res.message);
                }
            };

            fetchUser();
        } catch (error) {
            console.log(error);
        }
    }, [comment]);

    // console.log(user);

    const handleEdit = () => {
        setIsEditing(true);
        setEditedComment(comment.content);
    };

    return (
        user && (
            <div className="flex p-4 border-b dark:border-gray-600 text-sm">
                <div className="flex-shrink-0 mr-3">
                    <img
                        src={user.profilePicture}
                        className="w-5 h-5 rounded-full bg-gray-200 "
                        alt={user.username}
                    />
                </div>
                <div className="flex-1">
                    <div className="flex items-center mb-1">
                        <span className="font-bold mr-1 text-xs truncate">
                            {user.username
                                ? `@${user.username}`
                                : "anonymous user"}
                        </span>
                        <span className="text-gray-500 text-xs">
                            {moment(comment.createdAt).fromNow()}
                        </span>
                    </div>

                    {isEditing ? (
                        <>
                            <Textarea
                                className="mb-2"
                                value={editedComment}
                                onChange={(e) =>
                                    setEditedComment(e.target.value)
                                }
                            ></Textarea>
                            <div className="w-full flex justify-end gap-2">
                                <Button
                                    className="text-sm "
                                    type="button"
                                    size="sm"
                                    gradientDuoTone="purpleToPink"
                                    onClick={() => {
                                        onSave(editedComment, comment);
                                        setIsEditing(false);
                                        setEditedComment(comment.content);
                                    }}
                                >
                                    Save
                                </Button>
                                <Button
                                    className="text-sm "
                                    type="button"
                                    size="sm"
                                    gradientDuoTone="purpleToPink"
                                    onClick={() => setIsEditing(false)}
                                    outline
                                >
                                    Cancel
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="text-gray-500 pb-2">
                                {comment.content}
                            </p>
                            <div className="flex pt-3 gap-2 text-xs border-t dark:border-gray-700 max-w-fit">
                                <button
                                    className={`text-gray-500 ${
                                        currentUser.payload &&
                                        comment.likes.includes(
                                            currentUser.payload._id
                                        ) &&
                                        "!text-blue-500"
                                    }`}
                                    type="button"
                                    onClick={() => {
                                        onLike(comment._id);
                                    }}
                                >
                                    <FaThumbsUp className="text-sm" />
                                </button>
                                <p className="text-gray-400 ">
                                    {comment.numberOfLikes > 0 &&
                                        comment.numberOfLikes +
                                            " " +
                                            (comment.numberOfLikes === 1
                                                ? "like"
                                                : "likes")}
                                </p>
                                {currentUser &&
                                    (currentUser.payload._id ===
                                        comment.userId ||
                                        currentUser.payload.admin) && (
                                        <>
                                            <button
                                                className="text-gray-400 hover:text-blue-400"
                                                onClick={handleEdit}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="text-gray-400 hover:text-red-400"
                                                onClick={() =>
                                                    onDelete(comment)
                                                }
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        )
    );
}
