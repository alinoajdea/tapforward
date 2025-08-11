"use client";

import dynamic from "next/dynamic";
import "easymde/dist/easymde.min.css";
import { useMemo } from "react";
import type { SimpleMDEReactProps } from "react-simplemde-editor";

// Load editor on client only (avoids SSR issues)
const SimpleMdeReact = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
};

export default function MarkdownEditor({ value, onChange, placeholder }: Props) {
  const options = useMemo<SimpleMDEReactProps["options"]>(() => ({
    spellChecker: false,
    status: false,
    autofocus: false,
    placeholder: placeholder ?? "Write something amazing…",
    minHeight: "140px",
    maxHeight: "320px",
    toolbar: [
      "bold","italic","strikethrough","|",
      "heading","quote","unordered-list","ordered-list","|",
      "link","horizontal-rule","|",
      "preview","guide"
    ],
    renderingConfig: { singleLineBreaks: false }
  }), [placeholder]);

  return (
    <div className="rounded-lg border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-red-400 focus-within:border-red-400 transition">
      <SimpleMdeReact value={value} onChange={onChange} options={options} />
    </div>
  );
}
