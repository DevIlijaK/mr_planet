import {
  Bold,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Heading4Icon,
  Italic,
  Link,
  ListOrderedIcon,
  QuoteIcon,
  Strikethrough,
  Underline,
} from "lucide-react";
import React, { useCallback } from "react";
import { Menubar } from "~/components/ui/menubar";
import { type Editor } from "@tiptap/react";
import { cn } from "~/lib/utils";
import { AlignMenu } from "./test-editor/allign-menu";
import { ListBulletIcon } from "@radix-ui/react-icons";

interface TextEditorProps {
  editor: Editor | null;
  content?: string;
  placeholder?: string;
  children?: React.ReactNode;
}

const TextEditor: React.FC<TextEditorProps> = ({
  editor,
  content,
  placeholder,
  children,
}) => {
  if (!editor) {
    return null;
  }

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href as string;
    const url = window.prompt("URL", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();

      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  return (
    <Menubar>
      <AlignMenu editor={editor} />

      <Bold
        onClick={() => {
          editor.chain().focus().toggleBold().run();
        }}
        className={cn("h-4 w-4 cursor-pointer hover:bg-gray-100")}
        strokeWidth={editor.isActive("bold") ? 3 : 2}
      />

      <Italic
        onClick={() => {
          editor.chain().focus().toggleItalic().run();
        }}
        className={cn("h-4 w-4 cursor-pointer hover:bg-gray-100")}
        strokeWidth={editor.isActive("italic") ? 3 : 2}
      />

      <Underline
        onClick={() => {
          editor.chain().focus().toggleUnderline().run();
        }}
        className={cn("h-4 w-4 cursor-pointer hover:bg-gray-100")}
        strokeWidth={editor.isActive("underline") ? 3 : 2}
      />
      <Strikethrough
        onClick={() => {
          editor.chain().focus().toggleStrike().run();
        }}
        className={cn("h-4 w-4 cursor-pointer hover:bg-gray-100")}
        strokeWidth={editor.isActive("strike") ? 3 : 2}
      />

      <Heading1Icon
        onClick={() => {
          editor.chain().focus().toggleHeading({ level: 1 }).run();
        }}
        className={cn("h-4 w-4 cursor-pointer hover:bg-gray-100")}
        strokeWidth={editor.isActive("heading", { level: 1 }) ? 3 : 2}
      />

      <Heading2Icon
        onClick={() => {
          editor.chain().focus().toggleHeading({ level: 2 }).run();
        }}
        className={cn("h-4 w-4 cursor-pointer hover:bg-gray-100")}
        strokeWidth={editor.isActive("heading", { level: 2 }) ? 3 : 2}
      />

      <Heading3Icon
        onClick={() => {
          editor.chain().focus().toggleHeading({ level: 3 }).run();
        }}
        className={cn("h-4 w-4 cursor-pointer hover:bg-gray-100")}
        strokeWidth={editor.isActive("heading", { level: 3 }) ? 3 : 2}
      />

      <Heading4Icon
        onClick={() => {
          editor.chain().focus().toggleHeading({ level: 4 }).run();
        }}
        className={cn("h-4 w-4 cursor-pointer hover:bg-gray-100")}
        strokeWidth={editor.isActive("heading", { level: 4 }) ? 3 : 2}
      />

      <QuoteIcon
        onClick={() => editor.chain().focus().setBlockquote().run()}
        // disabled={!editor.can().setBlockquote()}
        className={cn("h-4 w-4 cursor-pointer hover:bg-gray-100")}
        strokeWidth={editor.isActive("blockquote") ? 3 : 2}
      />

      <ListBulletIcon
        onClick={() => {
          editor.chain().focus().toggleBulletList().run();
        }}
        className={cn("h-4 w-4 cursor-pointer hover:bg-gray-100")}
        strokeWidth={editor.isActive("bulletList") ? 3 : 2}
      />

      <ListOrderedIcon
        onClick={() => {
          editor.chain().focus().toggleOrderedList().run();
        }}
        className={cn("h-4 w-4 cursor-pointer hover:bg-gray-100")}
        strokeWidth={editor.isActive("orderedList") ? 3 : 2}
      />

      <Link
        onClick={() => {
          editor.commands.toggleLink({ href: "https://example.com" });
        }}
        className={cn("h-4 w-4 cursor-pointer hover:bg-gray-100")}
        strokeWidth={editor.isActive("heading", { level: 4 }) ? 3 : 2}
      />
    </Menubar>
  );
};

export default TextEditor;
