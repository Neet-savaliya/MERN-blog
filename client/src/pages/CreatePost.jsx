import { Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function CreatePost() {
    return (
        <div className="min-h-screen p-3 max-w-3xl mx-auto">
            <h1 className="text-center text-3xl my-7 font-semibold">
                Create a Post
            </h1>
            <form action="">
                <div className="flex flex-col gap-4 sm:flex-row justify-between">
                  <TextInput type="text" placeholder="title" required id="title" className="flex-1 text-lg"/>
                  <Select>
                    <option value="uncategorized">Uncategorized</option>
                    <option value="javascript">Java Script</option>
                    <option value="reactjs">React.js</option>
                    <option value="nodejs">Node.js</option>
                  </Select>
                </div>
                <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3 mt-3">
                  <FileInput type="file" accept="image/*"/>
                  <Button type="button" gradientDuoTone="purpleToBlue">Upload Image</Button>
                </div>
                <ReactQuill theme="snow" placeholder="Write something..." className="h-72 mb-14 mt-5 border-black border-2"/>
                <Button type="submit"gradientDuoTone="purpleToPink" className="w-full">Publish</Button>
            </form>
        </div>
    );
}
