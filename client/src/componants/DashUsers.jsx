import { Button, Modal, ModalBody, ModalHeader, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { HiOutlineExclamationCircle } from "react-icons/hi2";
import { useSelector } from "react-redux";

export default function DashUsers() {
    const { currentUser } = useSelector((state) => state.user);
    const [users, setUsers] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [deleteUserId, setDeleteUserId] = useState(null);
    const [showModel, setShowModel] = useState(false);
    useEffect(() => {
        const fetchPost = async () => {
            const res = await fetch("/api/user/getUsers", {
                method: "GET",
            });
            const data = await res.json();
            if (res.ok) {
                if (data.users.length <= 9) {
                    setShowMore(false);
                }
                setUsers(data.users);
            }
        };

        if (currentUser.payload.admin) {
            fetchPost();
        }
    }, [currentUser.payload._id, currentUser.payload.admin]);

    const handleShowMore = async () => {
        const startIndex = users.length;
        try {
            const res = await fetch(
                `/api/user/getUsers&startIndex=${startIndex}`
            );

            const data = await res.json();
            if (res.ok && data.users.length > 0) {
                setUsers((prev) => [...prev, ...data.users]);
            }
            if (data.users.length < 9) {
                setShowMore(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const deleteUserHandler = () => {};

    return (
        <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
            {currentUser.payload.admin && users.length > 0 ? (
                <>
                    <Table hoverable className="shadow-md ">
                        <Table.Head>
                            <Table.HeadCell>Date Created</Table.HeadCell>
                            <Table.HeadCell>User image</Table.HeadCell>
                            <Table.HeadCell>Username</Table.HeadCell>
                            <Table.HeadCell>Email</Table.HeadCell>
                            <Table.HeadCell>Admin</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                        </Table.Head>
                        {users.map((user) => (
                            // eslint-disable-next-line react/jsx-key
                            <Table.Body key={`body${user._id}`}>
                                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell key={user.updatedAt + user._id}>
                                        {new Date(
                                            user.createdAt
                                        ).toLocaleDateString()}
                                    </Table.Cell>
                                    <Table.Cell key={user.slug}>
                                        <img
                                            src={user.profilePicture}
                                            alt="Post Image"
                                            className="w-10 h-10 rounded object-cover bg-gray-500"
                                        />
                                    </Table.Cell>
                                    <Table.Cell key={user.title}>
                                        {user.username}
                                    </Table.Cell>
                                    <Table.Cell key={user.title + user.slug}>
                                        {user.email}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {user.admin ? (
                                            <FaCheck className="text-green-500" />
                                        ) : (
                                            <FaTimes className="text-red-500"/>
                                        )}
                                    </Table.Cell>
                                    <Table.Cell key={`delete${user._id}`}>
                                        <span
                                            className="font-medium text-red-500 hover:underline cursor-pointer"
                                            onClick={() => {
                                                setDeleteUserId(user._id);
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
                            <Button color="failure" onClick={deleteUserHandler}>
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
