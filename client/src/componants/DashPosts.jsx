import { Button, Modal, ModalBody, ModalHeader, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi2";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function DashPosts() {
    const { currentUser } = useSelector((state) => state.user);
    const [userPost, setUserPost] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [deletePostId, setDeletePostId] = useState(null);
    const [showModel, setShowModel] = useState(false);
    useEffect(() => {
        const fetchPost = async () => {
            const res = await fetch("/api/post/posts", {
                method: "GET",
            });
            const data = await res.json();
            if (res.ok) {
                if (data.post.length <= 9) {
                    setShowMore(false);
                }
                setUserPost(data.post);
            }
        };

        if (currentUser.payload.admin) {
            fetchPost();
        }
    }, [currentUser.payload._id, currentUser.payload.admin]);

    const handleShowMore = async () => {
        const startIndex = userPost.length;
        try {
            const res = await fetch(
                `/api/post/Posts?userId=${currentUser.payload._id}&startIndex=${startIndex}`
            );

            const data = await res.json();
            console.log(data);
            if (res.ok && data.post.length > 0) {
                setUserPost((prev) => [...prev, ...data.post]);
                console.log(userPost);
            }
            if (data.post.length < 9) {
                setShowMore(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const deletePostHandler = async () => {
        const postId = deletePostId;
        try {
            const res = await fetch(`/api/post/delete-post/${postId}`, {
                method: "delete",
            });
            const data = await res.json();
            setShowModel(false);
            if (!res.ok) {
                console.log(data.message);
            } else {
                setUserPost((prev) =>
                    prev.filter((post) => post._id !== deletePostId)
                );
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
            {currentUser.payload.admin && userPost.length > 0 ? (
                <>
                    <Table hoverable className="shadow-md ">
                        <Table.Head key="head">
                            <Table.HeadCell key="Date">
                                Date Updated
                            </Table.HeadCell>
                            <Table.HeadCell key="Image">
                                Post image
                            </Table.HeadCell>
                            <Table.HeadCell key="title">
                                Post title
                            </Table.HeadCell>
                            <Table.HeadCell key="category">
                                Category
                            </Table.HeadCell>
                            <Table.HeadCell key="Delete">Delete</Table.HeadCell>
                            <Table.HeadCell key="edit">
                                <span>Edit</span>
                            </Table.HeadCell>
                        </Table.Head>
                        {userPost.map((post) => (
                            // eslint-disable-next-line react/jsx-key
                            <Table.Body key={`body${post._id}`}>
                                <Table.Row
                                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                                    key="row"
                                >
                                    <Table.Cell key={post.updatedAt + post._id}>
                                        {new Date(
                                            post.updatedAt
                                        ).toLocaleDateString()}
                                    </Table.Cell>
                                    <Table.Cell key={post.slug}>
                                        <Link to={`/post/${post.slug}`}>
                                            <img
                                                src={post.image}
                                                alt="Post Image"
                                                className="w-20 h-10 object-cover bg-gray-500"
                                            />
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell key={post.title}>
                                        <Link
                                            className="font-medium text-gray-900 dark:text-white"
                                            to={`/post/${post.slug}`}
                                        >
                                            {post.title}
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell key={post.title + post.slug}>{post.category}</Table.Cell>
                                    <Table.Cell key={`delete${post._id}`}>
                                        <span
                                            className="font-medium text-red-500 hover:underline cursor-pointer"
                                            onClick={() => {
                                                setDeletePostId(post._id);
                                                setShowModel(true);
                                            }}
                                        >
                                            Delete
                                        </span>
                                    </Table.Cell>
                                    <Table.Cell key={`edit${post._id} `}>
                                        <Link to={`/update-post/${post._id}`}>
                                            <span className="text-teal-500 cursor-pointer hover:underline">
                                                Edit
                                            </span>
                                        </Link>
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
                <p>No post yet..</p>
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
                            Are you sure you want to delete your account?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={deletePostHandler}>
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
