import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function Oauth() {
    const auth = getAuth(app);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const googleAuthHandler = () => {
        const provider = new GoogleAuthProvider();

        provider.setCustomParameters({ prompt: "select_account" });
        try {
            signInWithPopup(auth, provider)
                .then((data) => {
                    return fetch("/api/auth/google", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            name: data.user.displayName,
                            email: data.user.email,
                            googlePhotoUrl: data.user.photoURL,
                        }),
                        credentials:"include"
                    })
                        .then((res) => {
                            if (res.ok) {
                                // let bodyData;
                                // res.json().then((data) => {
                                //     bodyData = data;
                                // });
                                // console.log(bodyData);
                                // console.log(
                                //     "Response From Oauth Sides",
                                //     bodyData
                                // );
                                return res.json();
                            }
                        })
                        .catch((err) => console.log(err));
                })
                .then((data) => {
                    console.log("data from google", 2);
                    dispatch(signInSuccess(data));
                    return navigate("/");
                });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Button
            type="button"
            outline
            gradientDuoTone="pinkToOrange"
            onClick={googleAuthHandler}
        >
            <AiFillGoogleCircle className="h-6 w-6 mr-2" />
            Continue with google
        </Button>
    );
}
