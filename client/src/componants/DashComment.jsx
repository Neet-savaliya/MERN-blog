import { Button, Modal, ModalBody, ModalHeader, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi2";
import { useSelector } from "react-redux";

export default function DashComments() {
    const { currentUser } = useSelector((state) => state.user);
    const [comments, setComments] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [deleteCommentId, setDeleteCommentId] = useState(null);
    const [showModel, setShowModel] = useState(false);
    useEffect(() => {
        const fetchPost = async () => {
            const res = await fetch("/api/comment/getComment", {
                method: "GET",
            });
            const data = await res.json();
            if (res.ok) {
                if (data.comment.length <= 9) {
                    setShowMore(false);
                }
                setComments(data.comment);
            }
        };

        if (currentUser.payload.admin) {
            fetchPost();
        }
    }, [currentUser.payload._id, currentUser.payload.admin]);

    const handleShowMore = async () => {
        const startIndex = comments.length;
        try {
            const res = await fetch(
                `/api/user/getComments&startIndex=${startIndex}`
            );

            const data = await res.json();
            if (res.ok && data.comments.length > 0) {
                setComments((prev) => [...prev, ...data.comments]);
            }
            if (data.comments.length < 9) {
                setShowMore(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const deleteCommentHandler = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(
                `/api/comment/delete/${deleteCommentId}/${currentUser.payload._id}`,
                {
                    method: "DELETE",
                }
            );
            const data = await res.json();

            if (res.ok) {
                setComments((prev) =>
                    prev.filter((comment) => comment._id !== deleteCommentId)
                );
                setShowModel(false);
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
            {currentUser.payload.admin && comments.length > 0 ? (
                <>
                    <Table hoverable className="shadow-md ">
                        <Table.Head>
                            <Table.HeadCell>Date Created</Table.HeadCell>
                            <Table.HeadCell>Content</Table.HeadCell>
                            <Table.HeadCell>Likes</Table.HeadCell>
                            <Table.HeadCell>PostId</Table.HeadCell>
                            <Table.HeadCell>UserId</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                        </Table.Head>
                        {comments.map((comment) => (
                            // eslint-disable-next-line react/jsx-key
                            <Table.Body key={comment._id}>
                                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell
                                        key={comment.updatedAt + comment._id}
                                    >
                                        {new Date(
                                            comment.updatedAt
                                        ).toLocaleDateString()}
                                    </Table.Cell>
                                    <Table.Cell key={comment.slug}>
                                        {comment.content}
                                    </Table.Cell>
                                    <Table.Cell key={comment.title}>
                                        {comment.numberOfLikes}
                                    </Table.Cell>
                                    <Table.Cell
                                        key={comment.title + comment.slug}
                                    >
                                        {comment.postId}
                                    </Table.Cell>
                                    <Table.Cell>{comment.userId}</Table.Cell>
                                    <Table.Cell key={`delete${comment._id}`}>
                                        <span
                                            className="font-medium text-red-500 hover:underline cursor-pointer"
                                            onClick={() => {
                                                setDeleteCommentId(comment._id);
                                                setShowModel(true);
                                            }}
                                        >
                                            Delete
                                        </span>
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>
                    {showMore && (
                        <button
                            className="text-teal-500 w-full self-center text-sm py-7"
                            onClick={handleShowMore}
                        >
                            Show more
                        </button>
                    )}
                </>
            ) : (
                <p>No Comment yet..</p>
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
                            Are you sure you want to delete this comment?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button
                                color="failure"
                                onClick={deleteCommentHandler}
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
