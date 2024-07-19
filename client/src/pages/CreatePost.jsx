import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useState } from "react";
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

export default function CreatePost() {
    const [file, setFile] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [formData, setFormData] = useState({});
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
                            setFormData({ ...formData, imageUrl: downloadUrl });
                        }
                    );
                }
            );
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="min-h-screen p-3 max-w-3xl mx-auto">
            <h1 className="text-center text-3xl my-7 font-semibold">
                Create a Post
            </h1>
            <form action="">
                <div className="flex flex-col gap-4 sm:flex-row justify-between">
                    <TextInput
                        type="text"
                        placeholder="Title"
                        required
                        id="title"
                        className="flex-1 text-lg"
                    />
                    <Select>
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
                        disabled = {imageUploadProgress}
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
                {formData.imageUrl && (
                    <img
                        className="w-full h-72 object-cover mt-3"
                        src={formData.imageUrl}
                        alt="Picture"
                    />
                )}
                <ReactQuill
                    theme="snow"
                    placeholder="Write something..."
                    className="h-72 mb-14 mt-5 border-black border-2"
                />
                <Button
                    type="submit"
                    gradientDuoTone="purpleToPink"
                    className="w-full"
                >
                    Publish
                </Button>
            </form>
        </div>
    );
}
