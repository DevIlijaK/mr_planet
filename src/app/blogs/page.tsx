import { getBlogs } from "~/server/queries";
import bg from "../../../public/images/background.jpg";
import Image from "next/image";
import Link from "next/link";

export default async function BlogsPage() {
  const blogs = await getBlogs();

  return (
    <div className="flex h-screen flex-col gap-4 overflow-y-scroll p-4 text-white">
      <Image
        priority
        sizes="100dvw"
        src={bg}
        alt="background-image"
        className="-z-50 h-screen w-full object-cover object-center"
        fill
      />
      {blogs.map((blog) => (
        <Link
          href={`/blog-builder/?id=${blog.id}`}
          key={blog.id}
          className="block no-underline"
        >
          <div className="cursor-pointer rounded-2xl border border-solid p-2 hover:bg-blue-300">
            {blog.id}
          </div>
        </Link>
      ))}
    </div>
  );
}
