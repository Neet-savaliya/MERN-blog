import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function UpdatePost() {
    const { currentUser } = useSelector((state) => state.user);
    const [file, setFile] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [formData, setFormData] = useState({});
    const [uploadPostError, setUploadPostError] = useState(null);
    const navigate = useNavigate();
    const { postId } = useParams();

    useEffect(() => {
        try {
            const getPostData = async () => {
                const res = await fetch(`/api/post/posts?postId=${postId}`);
                const data = await res.json();

                if (!res.ok) {
                    console.log(data.message);
                    setUploadPostError(data.message);
                }

                if (res.ok) {
                    setFormData(data.post[0]);
                    setUploadPostError(null);
                }
            };

            getPostData();
        } catch (error) {
            console.log(error);
        }
    }, [postId]);

    const handleFileSubmit = () => {
        try {
            if (!file) {
                setImageUploadError("Please select the file");
                return;
            }
            setImageUploadError(null);
            const storage = getStorage(app);
            const fileName = new Date().now + "-" + file.name;
            const StorageRef = ref(storage, fileName);

            const uploadTask = uploadBytesResumable(StorageRef, file);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImageUploadProgress(progress.toFixed(0));
                },
                (error) => {
                    setImageUploadError(error);
                    setImageUploadProgress(null);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(
                        (downloadUrl) => {
                            setImageUploadError(null);
                            setImageUploadProgress(null);
                            setFormData({ ...formData, image: downloadUrl });
                        }
                    );
                }
            );
        } catch (error) {
            console.log(error);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/post/update-post/${postId}`, {
                method: "put",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    admin: currentUser.payload.admin,
                    userId: currentUser.payload._id,
                }),
            });
            const data = await res.json();

            if (!res.ok) {
                setUploadPostError(data.message);
            }
            if (res.ok) {
                setUploadPostError(null);
                navigate(`/${data.slug}`);
            }
        } catch (err) {
            setUploadPostError(err);
        }
    };
    return (
        <div className="min-h-screen p-3 max-w-3xl mx-auto">
            <h1 className="text-center text-3xl my-7 font-semibold">
                Update a Post
            </h1>
            <form onSubmit={handleFormSubmit}>
                <div className="flex flex-col gap-4 sm:flex-row justify-between">
                    
                        <TextInput
                            value={formData.title}
                            type="text"
                            placeholder="Title"
                            required
                            id="title"
                            className="flex-1 text-lg"
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    title: e.target.value,
                                });
                            }}
                        />
                    
                    
                        <Select
                            value={formData.category}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    category: e.target.value,
                                });
                            }}
                        >
                            <option value="uncategorized">Uncategorized</option>
                            <option value="javascript">Java Script</option>
                            <option value="reactjs">React.js</option>
                            <option value="nodejs">Node.js</option>
                        </Select>
                    
                </div>
                <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3 my-3">
                    <FileInput
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            setFile(e.target.files[0]);
                        }}
                        disabled={imageUploadProgress}
                    />
                    <Button
                        type="button"
                        gradientDuoTone="purpleToBlue"
                        onClick={handleFileSubmit}
                        disabled={imageUploadProgress}
                    >
                        {imageUploadProgress ? (
                            <div className="w-16 h-16">
                                <CircularProgressbar
                                    value={imageUploadProgress}
                                    text={`${imageUploadProgress || 0} %`}
                                />{" "}
                            </div>
                        ) : (
                            "Upload Image"
                        )}
                    </Button>
                </div>
                {imageUploadError && (
                    <Alert color="failure">{imageUploadError}</Alert>
                )}
                {formData.image && (
                    <img
                        className="w-full h-72 object-cover mt-3"
                        src={formData.image}
                        alt="Picture"
                    />
                )}
                <>
                    <ReactQuill
                        value={formData.content}
                        theme="snow"
                        placeholder="Write something..."
                        className="h-72 mb-5 mt-5 border-black border-2 "
                        onChange={(value) => {
                            setFormData({ ...formData, content: value });
                        }}
                    />
                </>

                <Button
                    type="submit"
                    gradientDuoTone="purpleToPink"
                    className="w-full"
                >
                    Update
                </Button>
            </form>
            {uploadPostError && (
                <Alert color="failure" className="mt-5">
                    {uploadPostError}
                </Alert>
            )}
        </div>
    );
}
