import { Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function DashPosts() {
    const { currentUser } = useSelector((state) => state.user);
    const [userPost, setUserPost] = useState([]);
    const [showMore, setShowMore] = useState(true);
    useEffect(() => {
        const fetchPost = async () => {
            const res = await fetch("/api/post/posts", {
                method: "GET",
            });
            const data = await res.json();
            if (res.ok) {
                if (data.post.length < 9) {
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
            if(data.post.length < 9){
                setShowMore(false)
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
                        <Table.Head>
                            <Table.HeadCell>Date Updated</Table.HeadCell>
                            <Table.HeadCell>Post image</Table.HeadCell>
                            <Table.HeadCell>Post title</Table.HeadCell>
                            <Table.HeadCell>Category</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                            <Table.HeadCell>
                                <span>Edit</span>
                            </Table.HeadCell>
                        </Table.Head>
                        {userPost.map((post) => (
                            // eslint-disable-next-line react/jsx-key
                            <Table.Body>
                                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell>
                                        {new Date(
                                            post.updatedAt
                                        ).toLocaleDateString()}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link to={`/post/${post.slug}`}>
                                            <img
                                                src={post.image}
                                                alt="Post Image"
                                                className="w-20 h-10 object-cover bg-gray-500"
                                            />
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link
                                            className="font-medium text-gray-900 dark:text-white"
                                            to={`/post/${post.slug}`}
                                        >
                                            {post.title}
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell>{post.category}</Table.Cell>
                                    <Table.Cell>
                                        <span className="font-medium text-red-500 hover:underline cursor-pointer">
                                            Delete
                                        </span>
                                    </Table.Cell>
                                    <Table.Cell>
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
        </div>
    );
}
