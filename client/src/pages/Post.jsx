import { Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
export default function Post() {
    const { postSlug } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [post, setPost] = useState(null);

    console.log(post);

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
                    console.log(error);
                }

                if (!res.ok) {
                    setError(data.message);
                    setLoading(false);
                }
            };

            fetchPost();
        } catch (error) {
            setError(error);
            setLoading(false);
        }

        console.log(postSlug);
    }, [postSlug]);

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
        </main>
    );
}
