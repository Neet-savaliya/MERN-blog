import { Footer } from "flowbite-react";
import {
    BsDiscord,
    BsFacebook,
    BsGift,
    BsInstagram,
    BsTwitter,
} from "react-icons/bs";
import { Link } from "react-router-dom";

export default function FooterCom() {
    return (
        <Footer container className="border border-t-8 border-teal-500">
            <div className="w-full max-w-7xl mx-auto">
                <div className="grid w-full justify-between sm:flex md:grid-cols-1">
                    <div className="mt-5">
                        <Link className="self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white">
                            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-pink-500 text-white rounded-lg">
                                Neet&lsquo;s
                            </span>
                            Blog
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3">
                        <div>
                            <Footer.Title title="About" />
                            <Footer.LinkGroup col>
                                <Footer.Link
                                    href="https://localhost:5173/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    100 nodejs project
                                </Footer.Link>
                                <Footer.Link
                                    href="#"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Blogs
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                        <div>
                            <Footer.Title title="Connect" />
                            <Footer.LinkGroup col>
                                <Footer.Link
                                    href="https://www.instagram.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    instagram
                                </Footer.Link>
                                <Footer.Link
                                    href="https://www.github.com/neetsavaliya/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    github
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                        <div>
                            <Footer.Title title="Legal" />
                            <Footer.LinkGroup col>
                                <Footer.Link href="#">
                                    Privacy policy
                                </Footer.Link>
                                <Footer.Link href="#">
                                    Terms & condition
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                    </div>
                </div>
                <Footer.Divider />
                <div className="w-full sm:flex sm:item-center sm:justify-between">
                    <Footer.Copyright
                        href="#"
                        by="Neet's Blog"
                        year={new Date().getFullYear()}
                    />
                    <div className="flex gap-6 sm:mt-0 sm:justify-center mt-4">
                        <Footer.Icon href="#" icon={BsFacebook} />
                        <Footer.Icon href="#" icon={BsInstagram} />
                        <Footer.Icon href="#" icon={BsTwitter} />
                        <Footer.Icon href="#" icon={BsGift} />
                        <Footer.Icon href="#" icon={BsDiscord} />
                    </div>
                </div>
            </div>
        </Footer>
    );
}
