"use client";

import { useState } from "react";
import Image from "next/image";

const SEARCH_MODES = ["boolean", "vector", "lsa"];

export default function MultiSearchPage() {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("boolean");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const res = await fetch(
        `https://eternal-prime-baboon.ngrok-free.app/search/${mode}?q=${encodeURIComponent(query)}`
      );
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
        {/* Logo top right */}
        <div className="absolute top-6 right-6">
          <Image
            src="/Logo_UIT.jpg"
            alt="UIT Logo"
            width={70}
            height={70}
            className=""
            priority
          />
        </div>

        <h1 className="text-3xl font-bold text-center text-[#004080] mb-2">
          CS419.P21 - Multi-Mode Search Engine
        </h1>
        <p className="text-center text-sm text-[#336699] mb-6 italic">
          Chọn chế độ tìm kiếm và nhập truy vấn bên dưới.
        </p>

        <form
          onSubmit={handleSearch}
          className="mb-8 space-y-4"
          autoComplete="off"
        >
          <input
            type="text"
            placeholder="Nhập truy vấn tìm kiếm..."
            className="w-full px-5 py-3 border border-blue-200 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <div className="flex flex-col md:flex-row gap-4">
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="px-4 py-3 border border-blue-200 rounded shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none"
              // Remove default arrow with appearance-none
            >
              {SEARCH_MODES.map((m) => (
                <option key={m} value={m}>
                  {m.toUpperCase()} Search
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="px-6 py-2 bg-[#0073e6] text-white font-semibold rounded hover:bg-[#005bb5] transition text-sm"
              disabled={loading}
            >
              {loading ? "Đang tìm kiếm..." : "Tìm kiếm"}
            </button>
          </div>
        </form>

        {error && (
          <div className="text-red-600 mb-4 text-center text-sm font-medium">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {results.map((doc, index) => (
            <div
              key={index}
              className="bg-[#f4faff] border border-blue-100 p-4 rounded shadow-sm"
            >
              <h2 className="text-sm font-semibold text-[#004080] mb-1">
                Tài liệu #{index + 1}
              </h2>
              <p className="text-sm whitespace-pre-wrap">{doc}</p>
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