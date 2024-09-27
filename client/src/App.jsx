// eslint-disable-next-line no-unused-vars
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Project from "./pages/Project";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Header from "./componants/Header";
import FooterCom from "./componants/Footer";
import PrivateRoute from "./componants/PrivateRoute";
import CreatePost from "./pages/CreatePost";
import AdminRouteOnly from "./componants/AdminRouteOnly";
import UpdatePage from "./pages/UpdatePage";
import Post from "./pages/Post";
import ScrollToUp from "./componants/ScrollToUp";
import Search from "./pages/Search";

export default function App() {
    return (
        <>
            <BrowserRouter>
            <ScrollToUp/>
                <Header></Header>
                <Routes>
                    <Route path="/" element={<Home />}></Route>
                    <Route element={<PrivateRoute />}>
                        <Route
                            path="/dashboard"
                            element={<Dashboard />}
                        ></Route>
                    </Route>
                    <Route path="/about" element={<About />}></Route>
                    <Route path="/project" element={<Project />}></Route>
                    <Route path="/sign-in" element={<SignIn />}></Route>
                    <Route path="/sign-up" element={<SignUp />}></Route>
                    <Route path="/search" element={<Search />}></Route>
                    <Route element={<AdminRouteOnly />}>
                        <Route
                            path="/create-post"
                            element={<CreatePost />}
                        ></Route>
                        <Route
                            path="/update-post/:postId"
                            element={<UpdatePage />}
                        ></Route>
                    </Route>
                    <Route path="/post/:postSlug" element={<Post/>}></Route>
                </Routes>
                <FooterCom />
            </BrowserRouter>
        </>
    );
}
