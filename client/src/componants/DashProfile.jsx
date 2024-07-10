import { Alert, Button, TextInput } from "flowbite-react";
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
import {
    submitStart,
    submitSuccess,
    submitFail,
} from "../redux/user/userSlice";
import "react-circular-progressbar/dist/styles.css";

export default function DashProfile() {
    const { currentUser } = useSelector((state) => state.user);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileURL, setImageFileURL] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [formData, setFormData] = useState({});
    const [imageUploading, setImageUploading] = useState(false)
    const [updateStatus,setUpdateStatus] = useState(null);
    const imagePickerRef = useRef();
    const dispatch = useDispatch();

    const onImageChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        setImageFileURL(URL.createObjectURL(file));
    };

    useEffect(() => {
        if (imageFile) {
            uploadImage();
        }
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
                    setImageUploading(false)
                });
            }
        );
    };

    const handleDataChange = (e) => {
        setUpdateStatus(null)
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleFormSubmit = async (e) => {
        setUpdateStatus(null)
        e.preventDefault();

        if (Object.keys(formData).length === 0) { 
            setUpdateStatus({fail : "Values are not changed"})
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
                setUpdateStatus({fail : data.message})
            } else {
                dispatch(submitSuccess(data));
                setUpdateStatus({pass : "Profile Updated successfully"})
            }
        } catch (error) {
            dispatch(submitFail(error.message));
            setUpdateStatus({fail : error.message})
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
                {
                    !imageUploading &&  ( <Button type="submit" gradientDuoTone="purpleToBlue" outline>
                        Update
                    </Button> )
                }
                
                <div className="text-red-500 flex flex-row justify-between mt-5">
                    <span className=" cursor-pointer ">Delete Account</span>
                    <span className=" cursor-pointer ">Sign Out</span>
                </div>
            </form>

            {updateStatus && (<Alert color={updateStatus.fail ? "failure" : "success"} className="mt-5">{updateStatus.fail ? updateStatus.fail : updateStatus.pass}</Alert>)}
        </div>
    );
}
