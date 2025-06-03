// app/cranfield/ClientDocsViewer.tsx
"use client";

import { useState } from "react";

export default function ClientDocsViewer({
  docs,
}) {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold mb-8 text-center text-gray-800">
        📄 Cranfield Document Collection
      </h1>
      <ul className="grid grid-cols-1 gap-6">
        {docs.map((doc) => (
          <DocumentCard key={doc.file} file={doc.file} content={doc.content} />
        ))}
      </ul>
    </div>
  );
}

function DocumentCard({ file, content }) {
  const [open, setOpen] = useState(false);

  return (
    <li className="border rounded-xl shadow hover:shadow-md transition bg-white">
      <button
        className="w-full text-left px-4 py-3 flex justify-between items-center"
        onClick={() => setOpen(!open)}
      >
        <div className="text-sm font-mono text-gray-600">{file}</div>
        <span className="text-blue-500 text-xs">{open ? "Hide" : "View"}</span>
      </button>
      {open && (
        <div className="border-t px-4 py-3 max-h-80 overflow-auto text-sm whitespace-pre-wrap font-light text-gray-700">
          {content}
        </div>
      )}
    </li>
  );
}
