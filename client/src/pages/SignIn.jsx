// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TextInput, Label, Button, Alert, Spinner } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import {
    signInStart,
    signInSuccess,
    signInFail,
} from "../redux/user/userSlice";
import Oauth from "../componants/Oauth";

export default function SignIn() {
    const [inputText, setInputText] = useState({});
    const { loading, error: errorMessage } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function changeHandler(e) {
        setInputText({ ...inputText, [e.target.id]: e.target.value });
    }

    async function postToSignUp(e) {
        e.preventDefault();

        if (!inputText.email || !inputText.password) {
            dispatch(signInFail("Please enter all the fields."));
        }
        // console.log(JSON.stringify(inputText));
        try {
            dispatch(signInStart());
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(inputText),
                credentials:"include"
                // mode:"no-cors"
            });

            const data = await res.json();
            // console.log("data with token :", data);
            // const { rest } = data;
            // console.log(rest);
            if (!res.ok) {
                dispatch(signInFail(data.message));
            }else{
                dispatch(signInSuccess(data));
                navigate("/");
            }
        } catch (err) {
            dispatch(signInFail(err));
        }
    }

    return (
        <div className="flex md:flex-row flex-col min-h-screen justify-center items-center gap-5 mt-20 md:mt-0 lg:px-52 md:px-20">
            <div className="flex md:flex-1 flex-col items-center gap-3">
                <Link className=" text-2xl sm:text-4xl font-bold dark:text-white flex-1">
                    <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-pink-500 text-white rounded-lg">
                        Neet&lsquo;s
                    </span>
                    Blog
                </Link>
                <p className="p-5">
                    This is sample blog website created using react node js and
                    mongoDB.
                </p>
            </div>
            <div className="flex-1 md:p-5 w-2/4">
                <form
                    action=""
                    className="flex flex-col gap-5"
                    onSubmit={postToSignUp}
                >
                    <div className="flex flex-col gap-2 justify-start">
                        <Label>Email</Label>
                        <TextInput
                            placeholder="work@compny.com"
                            name="email"
                            id="email"
                            type="email"
                            onChange={changeHandler}
                        ></TextInput>
                    </div>
                    <div className="flex flex-col gap-2 justify-start">
                        <Label>Password</Label>
                        <TextInput
                            placeholder="*********"
                            name="password"
                            type="password"
                            id="password"
                            onChange={changeHandler}
                        ></TextInput>
                    </div>
                    <Button gradientDuoTone="purpleToPink" type="submit">
                        {loading ? (
                            <>
                                <Spinner size="sm" />
                                <span className="pl-3">Loading...</span>
                            </>
                        ) : (
                            "Sign Up"
                        )}
                    </Button>
                    <Oauth />
                </form>
                <div className="mt-10">
                    <span>Do not Have an account?</span>
                    <Link className="text-blue-600 p-3 text-sm" to="/sign-up">
                        Sign up
                    </Link>
                </div>
                {errorMessage && (
                    <Alert color="failure" className="mt-5" >
                        {errorMessage.payload}
                    </Alert>
                )}
            </div>
        </div>
    );
}
