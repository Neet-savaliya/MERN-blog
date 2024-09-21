// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../componants/DashSidebar";
import DashProfile from "../componants/DashProfile";
import DashPosts from "../componants/DashPosts";
import DashUsers from "../componants/DashUsers"
import DashComment from "../componants/DashComment";
import DashPanel from "../componants/DashPanel";

export default function Dashboard() {
    const location = useLocation();
    const [tab, setTab] = useState("");
    useEffect(() => {
        const urlPrams = new URLSearchParams(location.search);
        const tabFromUrl = urlPrams.get("tab");
        if (tabFromUrl) {
            setTab(tabFromUrl);
        }
    }, [location.search]);
    return (
        <div className="min-h-screen flex flex-col md:flex-row ">
            <div className="md:w-56">
                <DashSidebar className="" />
            </div>
            {/* For profile of user */}
            {tab === "profile" && <DashProfile />}

            {/* Post of users */}
            {tab === "posts" && <DashPosts />}

            {/* list of users */}
            {tab === "users" && <DashUsers/>}

            {/* Comment */}
            {tab === "comments" && <DashComment/>}

            {/* dashboard */}
            {tab === "dash" && <DashPanel/>}
        </div>
    );
}
