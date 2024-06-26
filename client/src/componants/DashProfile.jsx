import { Button, TextInput } from "flowbite-react";
import { useSelector } from "react-redux";

export default function DashProfile() {
    const { currentUser } = useSelector((state) => state.user);
    console.log(currentUser);
    return (
        <div className="m-auto max-w-lg p-3 w-full">
            <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
            <form className="flex flex-col gap-3">
                <div className="w-32 h-32 self-center courser-pointer rounded-full">
                    <img
                        src={currentUser.payload.profilePicture}
                        alt="user"
                        className="rounded-full w-full h-full object-cover border-8 border-[lightgray]"
                    />
                </div>
                <TextInput
                    type="string"
                    id="username"
                    placeholder="username"
                    defaultValue={currentUser.payload.username}
                />
                <TextInput
                    type="email"
                    id="email"
                    placeholder="email"
                    defaultValue={currentUser.payload.email}
                />
                <TextInput
                    type="password"
                    id="password"
                    placeholder="username"
                />
                <Button type="submit" gradientDuoTone="purpleToBlue" outline>
                    Update
                </Button>
                <div className="text-red-500 flex flex-row justify-between mt-5">
                  <span className=" cursor-pointer ">Delete Account</span>
                  <span className=" cursor-pointer ">Sign Out</span>
                </div>
            </form>
        </div>
    );
}
