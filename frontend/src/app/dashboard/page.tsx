"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import { claimsAPI, trustAPI } from "@/lib/api";
import { Claim, TrustScore } from "@/lib/types";
import { LogoFull, VerificationBadge, BottomNav } from "@/components/ui";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loadUser, isLoading, logout } = useAuthStore();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [trustData, setTrustData] = useState<TrustScore | null>(null);

  useEffect(() => { loadUser(); }, []);
  useEffect(() => { if (!isLoading && !user) router.push("/login"); }, [isLoading, user]);
  useEffect(() => {
    if (user) {
      claimsAPI.getMy().then((r) => setClaims(r.data)).catch(() => {});
      trustAPI.getScore(user.id).then((r) => setTrustData(r.data)).catch(() => {});
    }
  }, [user]);

  if (isLoading || !user) return <div className="min-h-screen flex items-center justify-center bg-li-black"><div className="w-8 h-8 border-2 border-li-white border-t-transparent rounded-full animate-spin"></div></div>;

  const score = trustData?.trust_score ?? user.trust_score;
  const verified = claims.filter((c) => c.status === "verified").length;
  const pending = claims.filter((c) => c.status === "pending" || c.status === "under_review").length;
  const levelLabels: Record<string, string> = { basic: "Basic Verified", verified_identity: "Identity Verified", proof_verified: "Proof Verified", elite: "Elite Professional" };

  return (
    <div className="min-h-screen bg-li-black pb-16 md:pb-0">
      {/* Top Nav */}
      <nav className="bg-black/70 backdrop-blur-md border-b border-li-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
          <Link href="/" className="hover:opacity-80 active:scale-95 transition-all"><LogoFull size={22} /></Link>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/dashboard" className="text-li-white font-semibold hover:-translate-y-0.5 transition-transform">Home</Link>
            <Link href="/search" className="text-li-gray hover:text-li-white hover:-translate-y-0.5 transition-all">Search</Link>
            <Link href="/network" className="text-li-gray hover:text-li-white hover:-translate-y-0.5 transition-all">Network</Link>
            <Link href="/notifications" className="text-li-gray hover:text-li-white hover:-translate-y-0.5 transition-all">Notifications</Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-li-surface-3 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer border border-li-border hover:border-li-white active:scale-90 transition-all" onClick={() => router.push(`/in/${user.lockedin_id}`)}>
              {user.name[0]}
            </div>
            <button onClick={() => { logout(); router.push("/"); }} className="text-li-gray text-xs hover:text-li-white active:scale-95 transition-all hidden md:block">Logout</button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Left: Profile Card — matches mockup's "John Doe" card */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl p-5">
            <div className="text-center mb-4">
              <div className="relative inline-block">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-2xl font-bold border border-white/10 mx-auto">{user.name[0]}</div>
                {user.verification_level !== "basic" && (
                  <div className="absolute -bottom-1 -right-1 badge-pulse rounded-full bg-li-black">
                    <VerificationBadge level={user.verification_level} size={18} />
                  </div>
                )}
              </div>
              <h2 className="font-bold text-base mt-3">{user.name}</h2>
              <p className="text-xs text-li-gray">{user.headline || "Add your headline"}</p>
              <p className="text-[10px] text-li-gray mt-0.5">@{user.lockedin_id}</p>
            </div>
            <div className="text-center py-1.5 rounded-full text-[10px] font-semibold bg-white/5 border border-white/10 text-li-gray-light mb-4">
              {levelLabels[user.verification_level] || "Basic Verified"}
            </div>

            {/* Verification Score Gauge — matches mockup's "87/100" style */}
            <div className="bg-white/5 rounded-xl border border-white/10 p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-li-gray uppercase tracking-wider font-semibold">Verification Score</span>
              </div>
              <div className="text-3xl font-black text-center">{score}<span className="text-sm text-li-gray font-normal">/100</span></div>
              <div className="w-full h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-li-white rounded-full score-bar-fill" style={{ "--score-width": `${score}%` } as React.CSSProperties}></div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div><div className="font-bold text-sm">{user.profile_views}</div><div className="text-[9px] text-li-gray">Views</div></div>
              <div><div className="font-bold text-sm">{verified}</div><div className="text-[9px] text-li-gray">Verified</div></div>
              <div><div className="font-bold text-sm">{claims.length}</div><div className="text-[9px] text-li-gray">Proofs</div></div>
            </div>
          </div>

          {/* Center: My Proofs — matches mockup's "My Proofs" section */}
          <div className="space-y-4">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm">My Proofs</h3>
                <Link href="/add-proof" className="text-[10px] font-semibold text-li-gray-light hover:text-li-white active:scale-95 transition-all">+ Add New Proof</Link>
              </div>
              {claims.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-li-gray mb-3">No proofs submitted yet</p>
                  <Link href="/add-proof" className="inline-block bg-li-white text-li-black px-5 py-2 rounded-full text-xs font-bold hover:scale-105 active:scale-95 transition-all shadow-md shadow-white/5">Add First Proof</Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {claims.map((c) => (
                    <div key={c.id} className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center border border-white/10">
                          <svg className="w-4 h-4 text-li-gray-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs font-semibold">{c.title}</p>
                          <p className="text-[10px] text-li-gray capitalize">{c.type}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        c.status === "verified" ? "border-li-white text-li-white" :
                        c.status === "rejected" ? "border-li-gray text-li-gray" :
                        "border-li-border text-li-gray-light"
                      }`}>
                        {c.status === "verified" ? "Verified" : c.status === "rejected" ? "Rejected" : "Pending"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top Proofs summary — matches mockup */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl p-5">
              <h3 className="font-bold text-sm mb-3">Top Proofs</h3>
              {claims.filter(c => c.status === "verified").length > 0 ? (
                claims.filter(c => c.status === "verified").slice(0, 3).map((c) => (
                  <div key={c.id} className="flex items-center justify-between py-2 border-b border-white/10 last:border-0">
                    <span className="text-xs">{c.title}</span>
                    <span className="text-[10px] text-li-white font-semibold">Verified</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-li-gray">No verified proofs yet</p>
              )}
              {claims.filter(c => c.status === "verified").length > 3 && (
                <button className="text-[10px] text-li-gray-light mt-2 hover:text-li-white hover:translate-x-1 transition-all">View All Proofs →</button>
              )}
            </div>
          </div>

          {/* Right: Professional Links + Score Breakdown */}
          <div className="space-y-4">
            {/* Score Breakdown */}
            {trustData?.breakdown && (
              <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl p-5">
                <h3 className="font-bold text-sm mb-3">Score Breakdown</h3>
                {Object.entries(trustData.breakdown).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between py-1.5">
                    <span className="text-xs text-li-gray-light capitalize">{key.replace(/_/g, " ")}</span>
                    <span className="text-xs font-semibold">+{val}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Professional Links — matches mockup */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl p-5">
              <h3 className="font-bold text-sm mb-3">Professional Links</h3>
              {[
                { label: "LinkedIn", url: user.linkedin_url },
                { label: "GitHub", url: user.github_url },
                { label: "Portfolio", url: user.portfolio_url },
              ].map((l) => (
                <div key={l.label} className="flex items-center justify-between py-2 border-b border-white/10 last:border-0">
                  <span className="text-xs text-li-gray-light">{l.label}</span>
                  {l.url ? <span className="text-[10px] font-semibold text-li-white">✓ Linked</span> : <span className="text-[10px] text-li-gray">Not linked</span>}
                </div>
              ))}
            </div>

            {/* Verified Skill Pills — matches mockup's "Verified Skill PM" style */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl p-5">
              <h3 className="font-bold text-sm mb-3">Skills</h3>
              <div className="flex flex-wrap gap-1.5">
                {(user.skills || []).length > 0 ? (
                  (user.skills as any[]).map((s: any) => (
                    <span key={s.id || s.name} className="text-[10px] font-semibold px-2.5 py-1 rounded-full border border-li-border text-li-gray-light">
                      {s.is_verified && "✓ "}{s.name}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-li-gray">No skills added</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav active="home" />
    </div>
  );
}
