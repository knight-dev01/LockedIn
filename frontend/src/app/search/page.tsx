"use client";

import { useState } from "react";
import Link from "next/link";
import { searchAPI } from "@/lib/api";
import { SearchResult } from "@/lib/types";
import { LogoFull, BottomNav } from "@/components/ui";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [minScore, setMinScore] = useState(0);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await searchAPI.professionals({ q: query || undefined, verified_only: verifiedOnly, min_score: minScore });
      setResults(res.data.results); setTotal(res.data.total); setSearched(true);
    } catch {} setLoading(false);
  };

  return (
    <div className="min-h-screen bg-li-black pb-16 md:pb-0">
      <nav className="bg-black/70 backdrop-blur-md border-b border-li-border sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between h-14">
          <Link href="/dashboard" className="hover:opacity-80 active:scale-95 transition-all"><LogoFull size={22} /></Link>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/dashboard" className="text-li-gray hover:text-li-white hover:-translate-y-0.5 transition-all">Home</Link>
            <span className="text-li-white font-semibold hover:-translate-y-0.5 transition-transform">Search</span>
            <Link href="/network" className="text-li-gray hover:text-li-white hover:-translate-y-0.5 transition-all">Network</Link>
            <Link href="/notifications" className="text-li-gray hover:text-li-white hover:-translate-y-0.5 transition-all">Notifications</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 pt-6">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 mb-4 shadow-lg">
          <div className="flex gap-2">
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-sm text-li-white placeholder-li-gray focus:outline-none focus:border-li-white transition-colors"
              placeholder="Search by skill, role, or keyword..." />
            <button onClick={handleSearch} disabled={loading}
              className="bg-li-white text-li-black px-6 py-3 rounded-xl text-sm font-bold hover:bg-li-text hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-md shadow-white/5">
              {loading ? "..." : "Search"}
            </button>
          </div>
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <button onClick={() => setVerifiedOnly(!verifiedOnly)}
              className={`px-3 py-1 rounded-full text-[10px] font-semibold border hover:scale-105 active:scale-95 transition-all ${verifiedOnly ? "bg-li-white text-li-black border-li-white" : "border-li-border text-li-gray hover:border-li-gray hover:text-li-white"}`}>
              ✓ Verified Only
            </button>
            {[50, 70, 80].map((s) => (
              <button key={s} onClick={() => setMinScore(minScore === s ? 0 : s)}
                className={`px-3 py-1 rounded-full text-[10px] font-semibold border hover:scale-105 active:scale-95 transition-all ${minScore === s ? "bg-li-white text-li-black border-li-white" : "border-li-border text-li-gray hover:border-li-gray hover:text-li-white"}`}>
                {s}+
              </button>
            ))}
          </div>
        </div>

        {searched && <p className="text-xs text-li-gray mb-3">{total} professionals found</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map((pro) => (
            <div key={pro.id} className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4 flex items-start gap-4 hover:-translate-y-1.5 hover:border-white/30 hover:shadow-[0_8px_30px_rgba(255,255,255,0.08)] active:scale-[0.98] transition-all duration-300">
              <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0 border border-white/10">{pro.name[0]}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm truncate">{pro.name}</h3>
                  <span className="text-[10px] text-li-gray">Score: {pro.trust_score}/100</span>
                </div>
                <p className="text-xs text-li-gray truncate">{pro.headline}{pro.company ? ` · ${pro.company}` : ""}</p>
                {pro.location && <p className="text-[10px] text-li-gray">{pro.location}</p>}
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {(pro.skills || []).slice(0, 3).map((s) => (
                    <span key={s.name} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-[9px] text-li-gray-light font-semibold uppercase tracking-wider">{s.name}</span>
                  ))}
                </div>
              </div>
              <Link href={`/in/${pro.lockedin_id}`} className="flex-shrink-0 border border-white/10 text-li-gray-light px-3 py-1.5 rounded-full text-[10px] font-semibold hover:border-white/30 hover:text-li-white hover:scale-105 active:scale-95 transition-all">
                View
              </Link>
            </div>
          ))}
          {searched && results.length === 0 && (
            <div className="text-center py-12"><p className="text-sm text-li-gray">No professionals found</p><p className="text-xs text-li-gray mt-1">Try different keywords or adjust filters</p></div>
          )}
        </div>
      </div>
      <BottomNav active="search" />
    </div>
  );
}
