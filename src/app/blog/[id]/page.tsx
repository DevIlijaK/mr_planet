import { getBlog } from "~/server/queries";
import DOMPurify from "isomorphic-dompurify";
import bg from "../../../../public/images/background.jpg";
import Image from "next/image";

type BlogPageProps = {
  params: { id: string };
};

export default async function BlogPage({ params: { id } }: BlogPageProps) {
  const blog = await getBlog({ id });
  if (!blog) return undefined;
  const sanitizedHtml = DOMPurify.sanitize(blog?.content);

  return (
    <div className="hide-scrollbar h-screen overflow-y-scroll">
      <Image
        priority
        sizes="100dvw"
        src={bg}
        alt="background-image"
        className="-z-50 h-screen w-full object-cover object-center"
        fill
      />
      <div
        className="p-4 text-white sm:p-10 lg:p-40"
        dangerouslySetInnerHTML={{
          __html: sanitizedHtml,
        }}
      />
    </div>
  );
}
