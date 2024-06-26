import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    Sidebar,
    SidebarItem,
    SidebarItemGroup,
    SidebarItems,
} from "flowbite-react";
import { FaArrowRight, FaUser } from "react-icons/fa";

export default function DashSidebar() {
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
        <Sidebar className="w-full md:w-56">
            <SidebarItems>
                <SidebarItemGroup>
                    <Link to="/dashboard?tab=profile">
                        <SidebarItem
                            icon={FaUser}
                            active={tab === "profile"}
                            label={"user"}
                            labelColor="dark"
                        >
                            Profile
                        </SidebarItem>
                    </Link>

                    <SidebarItem icon={FaArrowRight} className="cursor-pointer">
                        Sign Out
                    </SidebarItem>
                </SidebarItemGroup>
            </SidebarItems>
        </Sidebar>
    );
}
