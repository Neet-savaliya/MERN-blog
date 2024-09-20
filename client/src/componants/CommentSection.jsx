import {
    Button,
    Modal,
    ModalBody,
    ModalHeader,
    Textarea,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Comment from "./Comment";
import { HiOutlineExclamationCircle } from "react-icons/hi2";

// eslint-disable-next-line react/prop-types
export default function CommentSection({ postId }) {
    const { currentUser } = useSelector((state) => state.user);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [showModel, setShowModel] = useState(false);
    const [childComment, setChildComment] = useState(null);
    const navigate = useNavigate();

    const submitComment = async (e) => {
        e.preventDefault();
        if (comment.length > 200) {
            return;
        }
        try {
            const res = await fetch("/api/comment/create", {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: comment,
                    userId: currentUser.payload._id,
                    postId: postId,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setComment("");
                setComments([data, ...comments]);
            }
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        try {
            const fetchComment = async () => {
                const res = await fetch(
                    `/api/comment/getPostComment/${postId}`
                );
                if (res.ok) {
                    const data = await res.json();
                    setComments(data);
                }
            };
            fetchComment();
        } catch (error) {
            console.log(error);
        }
    }, [postId]);

    const handleLikes = async (commentId) => {
        if (!currentUser.payload) {
            navigate("/sign-in");
            return;
        }
        try {
            const res = await fetch(
                `/api/comment/like/${commentId}/${currentUser.payload._id}`,
                {
                    method: "PUT",
                }
            );

            if (res.ok) {
                const data = await res.json();

                setComments(
                    comments.map((comment) => {
                        return comment._id === commentId
                            ? {
                                  ...comment,
                                  likes: data.likes,
                                  numberOfLikes: data.likes.length,
                              }
                            : comment;
                    })
                );
            }
        } catch (error) {
            console.log(error);
        }
    };

    const onSaveEdited = async (commentContent, childComment) => {
        try {
            const isAdmin = currentUser.payload.admin;
            const res = await fetch(
                `/api/comment/edit/${childComment._id}/${currentUser.payload._id}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ content: commentContent, isAdmin }),
                }
            );

            if (!res.ok) {
                throw new Error("Not getting response");
            }
            const data = await res.json();
            console.log(data);
            setComments((prev) => {
                return prev.map((comment) => {
                    if (comment._id === data._id) {
                        return { ...comment, content: commentContent };
                    } else {
                        return comment;
                    }
                });
            });
        } catch (error) {
            console.log(error);
        }
    };

    const onDelete = async (childCommentArg) => {
        console.log(childCommentArg);
        try {
            const isAdmin = currentUser.payload.admin;

            if (!childCommentArg.userId === currentUser.payload._id && !currentUser.payload.admin) {
                return;
            }
            const res = await fetch(
                `/api/comment/delete/${childCommentArg._id}/${currentUser.payload._id}`,
                {
                    method: "delete",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ isAdmin }),
                }
            );
            if (!res.ok) {
                throw new Error("Not deleted.");
            }
            const data = await res.json();
            setComments((prev) => {
                return prev.filter((comment) => comment._id !== data._id);
            });
            setShowModel(false)
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            {currentUser ? (
                <div className="flex gap-2 items-center text-gray-500 text-sm">
                    <p>Signed in as</p>
                    <img
                        src={currentUser.payload.profilePicture}
                        alt="UserImage"
                        className="h-5 w-5 object-cover my-3 rounded-full"
                    />
                    <Link
                        to="/dashboard?tab=profile "
                        className="hover:underline text-teal-600 text-xs"
                    >
                        @{currentUser.payload.username}
                    </Link>
                </div>
            ) : (
                <div className="flex gap-1 text-teal-500 text-sm my-5">
                    <p>First sign in to see comments</p>
                    <Link
                        className="text-blue-500 hover:underline"
                        to="/sign-in"
                    >
                        Sign in
                    </Link>
                </div>
            )}

            {currentUser && (
                <form
                    className=" border border-teal-500 rounded-md p-3"
                    onSubmit={(e) => submitComment(e)}
                >
                    <Textarea
                        value={comment}
                        placeholder="Write Your Comment..."
                        rows="3"
                        maxLength="200"
                        onChange={(e) => {
                            setComment(e.target.value);
                        }}
                    />
                    <div className="flex items-center justify-between mt-5">
                        <p className="text-gray-500 text-xs">
                            {200 - comment.length} letters remaining
                        </p>
                        <Button
                            outline
                            gradientDuoTone="purpleToPink"
                            type="submit"
                        >
                            Submit
                        </Button>
                    </div>
                </form>
            )}

            {comments.length === 0 ? (
                <div className="text-sm text-gray-500 my-5">No Comments...</div>
            ) : (
                <>
                    <div className="flex my-5 items-center gap-2 text-sm">
                        <p>Comments</p>
                        <div className="border border-gray-500 py-1 px-2 rounded-sm">
                            <p>{comments.length}</p>
                        </div>
                    </div>
                    {comments.map((comment) => {
                        return (
                            <Comment
                                key={comment._id}
                                comment={comment}
                                onLike={handleLikes}
                                onSave={onSaveEdited}
                                onDelete={(comment) => {
                                    setShowModel(true);
                                    setChildComment(comment)
                                }}
                            />
                        );
                    })}
                </>
            )}
            <Modal
                show={showModel}
                onClose={() => {
                    setShowModel(false);
                }}
                size="md"
                popup
            >
                <ModalHeader />
                <ModalBody>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
                        <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete your comment?
                        </h3>
                        <div className="flex justify-center gap-4">
                            {console.log(childComment)}
                            <Button
                                color="failure"
                                onClick={() => onDelete(childComment)}
                            >
                                yes,Delete
                            </Button>
                            <Button
                                color="gray"
                                onClick={() => {
                                    setShowModel(false);
                                }}
                            >
                                No,cancel
                            </Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </div>
    );
}
