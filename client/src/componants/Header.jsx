//eslint-disable-next-line
import React, { useEffect, useState } from "react";
import { Link, redirect, useLocation, useNavigate } from "react-router-dom";
import {
    Avatar,
    Button,
    Dropdown,
    DropdownDivider,
    DropdownHeader,
    DropdownItem,
    Navbar,
    NavbarCollapse,
    TextInput,
} from "flowbite-react";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signOutSuccess } from "../redux/user/userSlice";

export default function Header() {
    const path = useLocation().pathname;
    const location = useLocation();
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);
    const { theme } = useSelector((state) => state.theme);
    const [searchTerm, setSearchTerm] = useState(null);
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            const res = await fetch("http://localhost:3000/api/user/sign-out", {
                method: "POST",
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.message);
            } else {
                dispatch(signOutSuccess());
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get("searchTerm");
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);
        }
    }, [searchTerm, location]); 

    const handleSubmit = (e) => {
        e.preventDefault()
        const urlParams = new URLSearchParams(location.search);
        urlParams.set("searchTerm", searchTerm);
        const searchQuery = urlParams.toString()
        navigate(`/search?${searchQuery}`)
    };

    return (
        <Navbar className="border-b-2">
            <Link className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white">
                <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-pink-500 text-white rounded-lg">
                    Neet&lsquo;s
                </span>
                Blog
            </Link>
            <form onSubmit={handleSubmit}>
                <TextInput
                    type="text"
                    rightIcon={AiOutlineSearch}
                    placeholder="Search..."
                    className="hidden lg:inline"
                    value={searchTerm || ""}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </form>
            <Button className="w-12 h-10 lg:hidden" color="gray" pill>
                <AiOutlineSearch />
            </Button>
            <div className="flex gap-2 md:order-2">
                <Button
                    className="w-12 h-10"
                    color="gray"
                    pill
                    onClick={() => dispatch(toggleTheme())}
                >
                    {theme == "light" ? <FaMoon /> : <FaSun />}
                </Button>
                {currentUser ? (
                    <Dropdown
                        arrowIcon={false}
                        inline
                        label={
                            <Avatar
                                rounded
                                alt="User"
                                img={currentUser.payload.profilePicture}
                            ></Avatar>
                        }
                    >
                        <DropdownHeader>
                            <span className="block text-sm ">
                                @{currentUser.payload.username}
                            </span>
                            <span className="block text-sm font-medium truncate">
                                {currentUser.payload.email}
                            </span>
                        </DropdownHeader>

                        <Link to="/dashboard?tab=profile">
                            <DropdownItem>Dashboard</DropdownItem>
                        </Link>
                        <DropdownDivider />
                        <Link to="sign-in">
                            <DropdownItem onClick={handleSignOut}>
                                Sign out
                            </DropdownItem>
                        </Link>
                    </Dropdown>
                ) : (
                    <Link to='sign-in'>
                    <Button className="" gradientDuoTone="purpleToBlue" outline >
                        SignIn
                    </Button>
                    </Link>
                )}
                <Navbar.Toggle />
            </div>
            <NavbarCollapse>
                <Navbar.Link active={path === "/"} as={"div"}>
                    <Link to="/" className="w-full block">
                        Home
                    </Link>
                </Navbar.Link>
                <Navbar.Link active={path === "/about"} as={"div"}>
                    <Link to="/about" className="w-full block">
                        About
                    </Link>
                </Navbar.Link>
                <Navbar.Link active={path === "/project"} as={"div"}>
                    <Link to="/project" className="w-full block">
                        Project
                    </Link>
                </Navbar.Link>
            </NavbarCollapse>
        </Navbar>
    );
}
