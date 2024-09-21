import { Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CallToAction from "../componants/CallToAction";
import CommentSection from "../componants/CommentSection";
import PostCard from "../componants/PostCard";
export default function Post() {
    const { postSlug } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [post, setPost] = useState(null);
    const [recentPost, setRecentPost] = useState([]);

    // console.log(post);

    useEffect(() => {
        try {
            const fetchPost = async () => {
                setLoading(true);
                setError(null);
                const res = await fetch(`/api/post/posts?slug=${postSlug}`);
                const data = await res.json();

                if (res.ok) {
                    setPost(data.post[0]);
                    setLoading(false);
                    setError(null);
                }

                if (!res.ok) {
                    setError(data.message);
                    setLoading(false);
                    console.log(error);
                }
            };

            fetchPost();
        } catch (error) {
            setError(error);
            setLoading(false);
        }

        // console.log(postSlug);
    }, [postSlug]);

    useEffect(() => {
        try {
            const getPost = async () => {
                const res = await fetch("/api/post/posts?limit=3", {
                    method: "get",
                });

                if (res.ok) {
                    const data = await res.json();
                    setRecentPost(data.post);
                }
            };
            getPost();
        } catch (error) {
            console.log(error);
        }
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner size="xl" />
            </div>
        );
    }

    return (
        <main className="flex flex-col min-h-screen max-w-6xl p-3 m-auto">
            <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
                {post && post.title}
            </h1>
            <Link
                to={`/search?category=${post && post.category}`}
                className="self-center mt-5"
            >
                <Button color="gray" pill size="xs">
                    {post && post.category}
                </Button>
            </Link>
            <img
                src={post && post.image}
                alt={post && post.title}
                className="mt-10 p-3 max-h-[600px] w-full object-cover"
            />
            <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
                <span>
                    {post && new Date(post.createdAt).toLocaleDateString()}
                </span>
                <span className="italic">
                    {post && (post.content.length / 1000).toFixed(0)} mins read
                </span>
            </div>
            <div
                className="p-3 max-w-2xl mx-auto w-full post-content"
                dangerouslySetInnerHTML={{ __html: post && post.content }}
            ></div>
            <CallToAction />
            <CommentSection postId={post._id} />
            <div className="flex flex-col items-center justify-center mb-5">
                <h1 className="text-xl mt-5">Recent Articles</h1>
                <div className="flex flex-wrap justify-center gap-5 mt-5">
                {recentPost.map((post) => {
                    return <PostCard post={post} key={post._id} />;
                })}
                </div>
            </div>
        </main>
    );
}
