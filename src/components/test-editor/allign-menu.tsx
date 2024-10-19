import { type Editor } from "@tiptap/react";
import {
  AlignCenter,
  ChevronDown,
  AlignJustify,
  AlignLeft,
  AlignRight,
} from "lucide-react";
import { type FC } from "react";
import { cn } from "~/lib/utils";
import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "../ui/menubar";

interface AlignMenuProps {
  editor: Editor;
}

export const AlignMenu: FC<AlignMenuProps> = ({ editor }) => {
  return (
    <MenubarMenu>
      <MenubarTrigger
        className={cn(
          "flex cursor-pointer",
          editor.isActive({ textAlign: "center" }) ||
            editor.isActive({ textAlign: "justify" }) ||
            editor.isActive({ textAlign: "left" }) ||
            editor.isActive({ textAlign: "right" })
            ? "bg-gray-100"
            : null,
        )}
      >
        <AlignCenter />
        <ChevronDown size={16} />
      </MenubarTrigger>
      <MenubarContent className="flex justify-between" align="center">
        <MenubarItem
          className={cn(
            "cursor-pointer",
            editor.isActive({ textAlign: "center" }) ? "bg-gray-100" : null,
          )}
          onClick={() => {
            if (editor.isActive({ textAlign: "center" })) {
              editor.chain().focus().setTextAlign("left").run();
            } else {
              editor.chain().focus().setTextAlign("center").run();
            }
          }}
        >
          <AlignCenter />
        </MenubarItem>
        <MenubarItem
          className={cn(
            "cursor-pointer",
            editor.isActive({ textAlign: "justify" }) ? "bg-gray-100" : null,
          )}
          onClick={() => {
            if (editor.isActive({ textAlign: "center" })) {
              editor.chain().focus().setTextAlign("left").run();
            } else {
              editor.chain().focus().setTextAlign("justify").run();
            }
          }}
        >
          <AlignJustify />
        </MenubarItem>
        <MenubarItem
          className={cn(
            "cursor-pointer",
            editor.isActive({ textAlign: "left" }) ? "bg-gray-100" : null,
          )}
          onClick={() => {
            if (editor.isActive({ textAlign: "center" })) {
              editor.chain().focus().setTextAlign("left").run();
            } else {
              editor.chain().focus().setTextAlign("left").run();
            }
          }}
        >
          <AlignLeft />
        </MenubarItem>
        <MenubarItem
          className={cn(
            "cursor-pointer",
            editor.isActive({ textAlign: "right" }) ? "bg-gray-100" : null,
          )}
          onClick={() => {
            if (editor.isActive({ textAlign: "center" })) {
              editor.chain().focus().setTextAlign("left").run();
            } else {
              editor.chain().focus().setTextAlign("right").run();
            }
          }}
        >
          <AlignRight />
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  );
};
