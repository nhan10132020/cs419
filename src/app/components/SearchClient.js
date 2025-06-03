"use client";

import { useState } from "react";

export default function SearchClient() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Failed to fetch results");
      const data = await res.json();
      setResults(data);
    } catch (err) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSearch} className="flex items-center gap-4 mb-8">
        <input
          type="text"
          placeholder="Search research documents..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <ul className="space-y-6">
        {results.map((doc) => (
          <li key={doc.file} className="bg-white border rounded-lg p-4 shadow">
            <h2 className="font-mono text-sm font-semibold text-gray-700 mb-2">{doc.file}</h2>
            <pre className="whitespace-pre-wrap text-sm text-gray-800 max-h-60 overflow-auto">{doc.content}</pre>
          </li>
        ))}
        {!loading && results.length === 0 && query && (
          <div className="text-center text-gray-500">No documents found.</div>
        )}
      </ul>
    </>
  );
}
