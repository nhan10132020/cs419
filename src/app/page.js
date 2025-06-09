"use client";

import { useState } from "react";
import Image from "next/image";

const SEARCH_MODES = ["boolean", "vector", "lsa"];
const TABS = ["cranfield", "vnexpress"];

export default function MultiSearchPage() {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("boolean");
  const [tab, setTab] = useState("cranfield");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [topK, setTopK] = useState(10);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const endpoint =
        tab === "vnexpress"
          ? `https://eternal-prime-baboon.ngrok-free.app/search/vnexpress?q=${encodeURIComponent(query)}&top_n=${topK}`
          : `https://eternal-prime-baboon.ngrok-free.app/search/${mode}?q=${encodeURIComponent(query)}&top_n=${topK}`;

      const res = await fetch(endpoint);
      if (!res.ok) throw new Error("Failed to fetch results");
      const data = await res.json();
      setResults(data.docs || []);
    } catch (err) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#e9f1fb] text-[#003366] font-sans py-10 px-4 flex justify-center">
      <div className="relative w-full max-w-5xl bg-white rounded-md shadow-lg border border-blue-300 p-8">
        {/* Logo */}
        <div className="absolute top-6 right-6">
          <Image
            src="/Logo_UIT.jpg"
            alt="UIT Logo"
            width={70}
            height={70}
            priority
          />
        </div>

        <h1 className="text-3xl font-bold text-center text-[#004080] mb-2">
          CS419.P21 - Multi-Mode Search Engine
        </h1>
        <p className="text-center text-sm text-[#336699] mb-6 italic">
          Chọn chế độ tìm kiếm và nhập truy vấn bên dưới.
        </p>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-6 space-x-6">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => {
                setTab(t);
                setQuery("");
                setResults([]);
                setError("");
                setLoading(false);
                setTopK(10);
              }}
              className={`px-5 py-2 text-sm font-medium rounded-t ${
                tab === t
                  ? "bg-white border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-blue-600"
              }`}
            >
              {t === "cranfield" ? "Cranfield" : "VNExpress"}
            </button>
          ))}
        </div>

        {/* Search Form */}
        <form
          onSubmit={handleSearch}
          className="mb-8 space-y-4"
          autoComplete="off"
        >
          <input
            type="text"
            placeholder={`Nhập truy vấn tìm kiếm...`}
            className="w-full px-5 py-3 border border-blue-200 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <div className="flex flex-col md:flex-row gap-4">
            {/* Only show mode selector for Cranfield */}
            {tab === "cranfield" && (
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="px-4 py-3 border border-blue-200 rounded shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none"
              >
                {SEARCH_MODES.map((m) => (
                  <option key={m} value={m}>
                    {m.toUpperCase()} Search
                  </option>
                ))}
              </select>
            )}

            {/* Top K Selector */}
            <div className="flex items-center gap-2">
              <select
                id="topK"
                value={topK}
                onChange={(e) => setTopK(Number(e.target.value))}
                className="px-4 py-3 border border-blue-200 rounded shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none"
              >
                {[10, 15, 20, 25, 30 ,35 ,40 ,45, 50].map((k) => (
                  <option key={k} value={k}>
                    Top {k}
                  </option>
                ))}
              </select>
            </div>


            <button
              type="submit"
              className="px-6 py-2 bg-[#0073e6] text-white font-semibold rounded hover:bg-[#005bb5] transition text-sm"
              disabled={loading}
            >
              {loading ? "Đang tìm kiếm..." : "Tìm kiếm"}
            </button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="text-red-600 mb-4 text-center text-sm font-medium">
            {error}
          </div>
        )}

        {/* Results */}
        <div className="space-y-6">
          {results.map((doc, index) => (
            <div
              key={index}
              className="bg-[#f4faff] border border-blue-100 p-4 rounded shadow-sm"
            >
              <h2 className="text-sm font-semibold text-[#004080] mb-1">
                {`Tài liệu #${index + 1}`}
              </h2>
              <p className="text-sm whitespace-pre-wrap">
                {tab === "vnexpress" ? (
                  <a
                    href={doc.url}
                    className="text-blue-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {doc.title}
                  </a>
                ) : (
                  <span>
                    {doc}
                  </span>
                )}
              </p>
            </div>
          ))}

          {!loading && results.length === 0 && query && (
            <p className="text-center text-gray-500 text-sm">
              Không tìm thấy tài liệu nào.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
