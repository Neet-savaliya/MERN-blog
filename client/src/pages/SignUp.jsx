// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { TextInput, Label, Button, Alert, Spinner } from "flowbite-react";

export default function SignUp() {
    const [inputText, setInputText] = useState({});
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    function changeHandler(e) {
        setInputText({ ...inputText, [e.target.id]: e.target.value });
    }

    async function postToSignUp(e) {
        e.preventDefault();

        if (!inputText.username || !inputText.email || !inputText.password) {
            setLoading(false);
            setErrorMessage("Please enter all the fields.");
        }
        console.log(JSON.stringify(inputText));
        try {
            setLoading(true);
            setErrorMessage(false);
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(inputText),
                // mode:"no-cors"
            });

            const data = await res.json();
            console.log("data success" , data.success);
            if(res.ok){
                navigate("/sign-in")
            }
            if (data.success === false) {
                setLoading(false);
                return setErrorMessage(data.message);
            }
            setLoading(false);
        } catch (err) {
            setLoading(false);
            setErrorMessage(err);
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
                        <Label>Username</Label>
                        <TextInput
                            placeholder="Username"
                            name="username"
                            id="username"
                            onChange={changeHandler}
                        ></TextInput>
                    </div>
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
                            placeholder="Password"
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
                </form>
                <div className="mt-10">
                    <span>Have an account?</span>
                    <Link className="text-blue-600 p-3 text-sm" to='/sign-in'>Sign in</Link>
                </div>
                {errorMessage && (
                    <Alert color="failure" mt-5>
                        {errorMessage}
                    </Alert>
                )}
            </div>
        </div>
    );
}
