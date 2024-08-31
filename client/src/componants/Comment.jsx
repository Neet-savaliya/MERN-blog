import moment from "moment/moment";
import { useEffect, useState } from "react";

export default function Comment({ comment }) {
    const [user, setUser] = useState({});

    useEffect(() => {
        // console.log(comment);
        try {
            const fetchUser = async () => {
                // console.log(comment.userId);
                const res = await fetch(`/api/user/${comment.userId}`);
                const fetchedUser = await res.json();

                if (res.ok) {
                    setUser(fetchedUser);
                    console.log(fetchedUser);
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

    console.log(user);

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
                    <p className="text-gray-500 pb-2">{comment.content}</p>
                </div>
            </div>
        )

        // <></>
    );
}
