"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextEditor from "./text-editor";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { useThrottle } from "~/hooks/use-throttle";
import { useEffect, useState } from "react";
import { getBlog, saveBlog } from "~/server/queries";
import { useRouter, useSearchParams } from "next/navigation";

const Tiptap = ({ editable }: { editable: boolean }) => {
  const [content, setContent] = useState<string | undefined>(undefined);
  const [initialContent, setInitialContent] = useState<string | undefined>(
    undefined,
  );
  const router = useRouter();
  const searchParams = useSearchParams();
  const throttledContent = useThrottle(content, 2000);

  const currentId = searchParams.get("id");

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          heading: {
            levels: [1, 2, 3, 4],
          },
        }),
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
        Underline,
        Link.configure({
          openOnClick: false,
          autolink: true,
          defaultProtocol: "https",
        }),
      ],
      editable,
      editorProps: {
        attributes: {
          class:
            "h-full prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none",
        },
      },
      content: initialContent,
      onUpdate: ({ editor }) => setContent(editor.getHTML()),
    },
    [initialContent],
  );

  useEffect(() => {
    const saveContent = async () => {
      if (!throttledContent) return;

      const response = await saveBlog({
        content: throttledContent,
        id: currentId ?? undefined,
      });

      const params = new URLSearchParams(searchParams);
      params.set("id", response);
      router.push(`?${params.toString()}`, { scroll: false });
    };

    void saveContent();
  }, [currentId, router, searchParams, throttledContent]);

  useEffect(() => {
    async function fetchBlog() {
      if (!currentId) {
        return;
      }
      const blog = await getBlog({ id: currentId });
      setInitialContent(blog?.content);
    }

    void fetchBlog();
  }, [currentId]);

  return (
    <>
      <TextEditor editor={editor} />
      <div className="h-full [&>*]:h-full">
        <EditorContent editor={editor} />
      </div>
    </>
  );
};

export default Tiptap;
