"use client";

import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

const modules = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "link"],
    ["clean"],
  ],
  clipboard: { matchVisual: false },
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "link",
];

export default function MarkdownEditor({ value, onChange, placeholder }: Props) {
  return (
    <div className="rounded-lg border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-red-400 focus-within:border-red-400 transition">
      <ReactQuill
        theme="snow"
        value={value || ""}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || "Write something amazing…"}
      />
      <style jsx global>{`
        /* Make editor body taller */
        .ql-editor {
          min-height: 4.5em; /* ~3 lines */
          padding: 0.75rem;
        }
        .ql-container.ql-snow {
          border: none;
        }
        .ql-toolbar.ql-snow {
          border: none;
          border-bottom: 1px solid #e5e7eb; /* Tailwind gray-200 */
        }
      `}</style>
    </div>
  );
}
