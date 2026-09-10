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
    <div
      className="hide-scrollbar h-[100dvh] overflow-y-scroll overscroll-contain"
      // viewport-fit=cover lets the starfield run under the notch; the text
      // must not follow it there when the phone is held sideways.
      style={{
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)",
      }}
    >
      <Image
        priority
        sizes="100dvw"
        src={bg}
        alt="background-image"
        className="-z-50 h-[100dvh] w-full object-cover object-center"
        fill
      />
      <div
        className="mx-auto max-w-[68ch] p-4 text-white sm:p-10 lg:py-24"
        dangerouslySetInnerHTML={{
          __html: sanitizedHtml,
        }}
      />
    </div>
  );
}
