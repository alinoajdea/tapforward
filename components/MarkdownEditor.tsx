"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useEffect } from "react";

type Props = {
  value: string;                   // HTML string
  onChange: (html: string) => void;
  placeholder?: string;
};

export default function RichTextEditor({ value, onChange, placeholder }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        protocols: ["https", "mailto"],
        autolink: true,
      }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[140px] px-3 py-2 outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // keep external value in sync (e.g., when editing an existing message)
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current) editor.commands.setContent(value || "", false);
  }, [value, editor]);

  if (!editor) return (
    <div className="rounded-lg border border-gray-300 bg-white h-[140px]" />
  );

  return (
    <div className="rounded-lg border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-red-400 focus-within:border-red-400 transition">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 border-b border-gray-200 p-2 text-sm">
        <Btn on={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}>B</Btn>
        <Btn on={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} italic>I</Btn>
        <Btn on={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")}>S</Btn>
        <Sep />
        <Btn on={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}>H2</Btn>
        <Btn on={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })}>H3</Btn>
        <Sep />
        <Btn on={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}>• List</Btn>
        <Btn on={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}>1. List</Btn>
        <Sep />
        <Btn on={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")}>&ldquo;Quote&rdquo;</Btn>
        <Btn on={() => editor.chain().focus().setLink({ href: prompt("Link URL") || "" }).run()} >Link</Btn>
        <Sep />
        <Btn on={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>Clear</Btn>
      </div>

      {/* Placeholder via CSS */}
      <div className="relative">
        {!editor.getText().length && (
          <span className="pointer-events-none absolute top-2 left-3 text-gray-400 text-sm">
            {placeholder ?? "Write something amazing…"}
          </span>
        )}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

function Btn({
  on,
  children,
  active,
  italic,
}: {
  on: () => void;
  children: React.ReactNode;
  active?: boolean;
  italic?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={on}
      className={`px-2 py-1 rounded border text-gray-700 hover:bg-gray-50 ${active ? "bg-gray-100 border-gray-300" : "border-gray-200"}`}
      style={italic ? { fontStyle: "italic" } : {}}
    >
      {children}
    </button>
  );
}
function Sep() {
  return <span className="w-px h-6 bg-gray-200 mx-1" />;
}
