import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    Sidebar,
    SidebarItem,
    SidebarItemGroup,
    SidebarItems,
} from "flowbite-react";
import { FaArrowRight, FaUser } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { signOutSuccess } from "../redux/user/userSlice";
import { HiDocumentText } from "react-icons/hi2";
import { useSelector } from "react-redux";

export default function DashSidebar() {
    const location = useLocation();
    const {currentUser} = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const [tab, setTab] = useState("");
    useEffect(() => {
        const urlPrams = new URLSearchParams(location.search);
        const tabFromUrl = urlPrams.get("tab");
        if (tabFromUrl) {
            setTab(tabFromUrl);
        }
    }, [location.search]);

    const handleSignOut = async() => {
        try {
            const res = await fetch("http://localhost:3000/api/user/sign-out", {
                method: "POST",
            });
            const data = await res.json();
            if(!res.ok){
                console.log(data.message);
            }else{
                dispatch(signOutSuccess());
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <Sidebar className="w-full md:w-56 ">
            <SidebarItems>
                <SidebarItemGroup className="flex-col flex gap-3">
                    <Link to="/dashboard?tab=profile">
                        <SidebarItem
                            icon={FaUser}
                            active={tab === "profile"}
                            label={currentUser.payload.admin?"Admin":"User"}
                            labelColor="dark"
                            as="div"
                        >
                            Profile
                        </SidebarItem>
                    </Link>
                    <Link to="/dashboard?tab=posts">
                        <SidebarItem
                            icon={HiDocumentText}
                            active={tab === "posts"}
                            labelColor="dark"
                            as="div"
                        >
                            Posts
                        </SidebarItem>
                    </Link>

                    <SidebarItem icon={FaArrowRight} className="cursor-pointer" onClick={handleSignOut}>
                        Sign Out
                    </SidebarItem>
                </SidebarItemGroup>
            </SidebarItems>
        </Sidebar>
    );
}
