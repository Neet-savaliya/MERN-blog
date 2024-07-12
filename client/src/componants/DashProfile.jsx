import {
    Alert,
    Button,
    Modal,
    ModalBody,
    ModalHeader,
    TextInput,
} from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import { HiOutlineExclamationCircle } from "react-icons/hi2";
import {
    submitStart,
    submitSuccess,
    submitFail,
    deleteStart,
    deleteSuccess,
    deleteFail,
    signOutSuccess,
} from "../redux/user/userSlice";
import "react-circular-progressbar/dist/styles.css";

export default function DashProfile() {
    const { currentUser } = useSelector((state) => state.user);
    const admin = currentUser.payload.admin;
    const [imageFile, setImageFile] = useState(null);
    const [imageFileURL, setImageFileURL] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [formData, setFormData] = useState({});
    const [imageUploading, setImageUploading] = useState(false);
    const [updateStatus, setUpdateStatus] = useState(null);
    const [showModel, setShowModel] = useState(false);
    const imagePickerRef = useRef();
    const dispatch = useDispatch();

    console.log();

    const onImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        setImageFileURL(URL.createObjectURL(file));
    };

    useEffect(() => {
        if (imageFile) {
            uploadImage();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [imageFile]);

    const uploadImage = () => {
        setImageUploadError(null);
        setImageUploading(true);
        const storage = getStorage(app);
        const fileName = new Date().getTime() + imageFile.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImageUploadProgress(progress.toFixed(0));
            },
            () => {
                setImageUploadError(
                    "File not Uploaded(File must be lesser than 2MB)"
                );
                setImageFile(null);
                setImageFileURL(null);
                setImageUploadProgress(null);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                    setImageFileURL(downloadUrl);
                    setImageUploadProgress(null);
                    setFormData({ ...formData, profilePicture: downloadUrl });
                    setImageUploading(false);
                });
            }
        );
    };

    const handleDataChange = (e) => {
        setUpdateStatus(null);
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleFormSubmit = async (e) => {
        setUpdateStatus(null);
        e.preventDefault();

        if (Object.keys(formData).length === 0) {
            setUpdateStatus({ fail: "Values are not changed" });
            return;
        }
        try {
            dispatch(submitStart());
            const res = await fetch(
                `http://localhost:3000/api/user/update/${currentUser.payload._id}`,
                {
                    method: "PUT",
                    body: JSON.stringify(formData),
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await res.json();
            if (!res.ok) {
                dispatch(submitFail(data.message));
                setUpdateStatus({ fail: data.message });
            } else {
                dispatch(submitSuccess(data));
                setUpdateStatus({ pass: "Profile Updated successfully" });
            }
        } catch (error) {
            dispatch(submitFail(error.message));
            setUpdateStatus({ fail: error.message });
        }
    };

    const handleDeleteAccount = async () => {
        setShowModel(false);
        try {
            dispatch(deleteStart());
            const res = await fetch(
                `api/user/delete/${currentUser.payload._id}`,
                {
                    method: "DELETE",
                }
            );
            const data = await res.json();
            if (!res.ok) {
                dispatch(deleteFail(data.message));
            } else {
                dispatch(deleteSuccess());
            }
        } catch (error) {
            dispatch(deleteFail());
        }
    };

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
    return (
        <div className="m-auto max-w-lg p-3 w-full">
            <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
            <form className="flex flex-col gap-3" onSubmit={handleFormSubmit}>
                <input
                    type="file"
                    accept="image/*"
                    onChange={onImageChange}
                    hidden
                    ref={imagePickerRef}
                />
                <div className=" relative w-32 h-32 self-center courser-pointer rounded-full">
                    {imageUploadProgress && (
                        <CircularProgressbar
                            value={imageUploadProgress || 0}
                            text={`${imageUploadProgress}%`}
                            strokeWidth={5}
                            styles={{
                                root: {
                                    width: "100%",
                                    height: "100%",
                                    position: "absolute ",
                                    top: 0,
                                    left: 0,
                                },
                                path: {
                                    stroke: `rgba(62,152,199,${
                                        imageUploadProgress / 100
                                    })`,
                                },
                            }}
                        />
                    )}

                    <img
                        src={imageFileURL || currentUser.payload.profilePicture}
                        alt="user"
                        className={` rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
                            imageUploadProgress &&
                            imageUploadProgress < 100 &&
                            "opacity-60"
                        }`}
                        onClick={() => {
                            imagePickerRef.current.click();
                        }}
                    />
                </div>
                {imageUploadError && (
                    <Alert color="failure">{imageUploadError}</Alert>
                )}
                <TextInput
                    type="string"
                    id="username"
                    placeholder="username"
                    defaultValue={currentUser.payload.username}
                    onChange={handleDataChange}
                />
                <TextInput
                    type="email"
                    id="email"
                    placeholder="email"
                    defaultValue={currentUser.payload.email}
                    onChange={handleDataChange}
                />
                <TextInput
                    type="password"
                    id="password"
                    placeholder="*********"
                    onChange={handleDataChange}
                />
                {!imageUploading && (
                    <Button
                        type="submit"
                        gradientDuoTone="purpleToBlue"
                        outline
                    >
                        Update
                    </Button>
                )}
                {admin && (
                    <Button type="submit" gradientDuoTone="purpleToPink">
                        Create post
                    </Button>
                )}

                <div className="text-red-500 flex flex-row justify-between mt-5">
                    <span
                        className=" cursor-pointer "
                        onClick={() => {
                            setShowModel(true);
                        }}
                    >
                        Delete Account
                    </span>
                    <span className=" cursor-pointer \" onClick={handleSignOut}>
                        Sign Out
                    </span>
                </div>
            </form>

            {updateStatus && (
                <Alert
                    color={updateStatus.fail ? "failure" : "success"}
                    className="mt-5"
                >
                    {updateStatus.fail ? updateStatus.fail : updateStatus.pass}
                </Alert>
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
                            <Button
                                color="failure"
                                onClick={handleDeleteAccount}
                            >
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
