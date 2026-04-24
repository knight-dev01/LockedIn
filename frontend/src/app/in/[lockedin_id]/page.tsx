"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { profileAPI } from "@/lib/api";
import { PublicProfile } from "@/lib/types";
import { LogoFull, VerificationBadge, PadlockLogo } from "@/components/ui";

export default function PublicProfilePage() {
  const params = useParams();
  const lid = params.lockedin_id as string;
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");

  useEffect(() => { if (lid) profileAPI.getPublic(lid).then((r) => setProfile(r.data)).catch(() => {}).finally(() => setLoading(false)); }, [lid]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-li-black"><div className="w-8 h-8 border-2 border-li-white border-t-transparent rounded-full animate-spin"></div></div>;
  if (!profile) return <div className="min-h-screen flex items-center justify-center flex-col gap-3 bg-li-black"><h1 className="text-xl font-bold">Profile Not Found</h1><Link href="/" className="text-sm text-li-gray hover:text-li-white">← Back</Link></div>;

  const levelLabels: Record<string, string> = { basic: "Basic Verified", verified_identity: "Identity Verified", proof_verified: "Proof Verified", elite: "Elite Professional" };
  const tabList = ["Overview", "Experience", "Skills", "Proofs"];

  return (
    <div className="min-h-screen bg-li-black">
      {/* Nav */}
      <nav className="bg-black/70 backdrop-blur-md border-b border-li-border sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-14">
          <Link href="/" className="hover:opacity-80 active:scale-95 transition-all"><LogoFull size={22} /></Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-xs text-li-gray hover:text-li-white hover:-translate-y-0.5 active:scale-95 transition-all">Log In</Link>
            <Link href="/register" className="bg-li-white text-li-black px-4 py-1.5 rounded-full text-xs font-bold hover:bg-li-text hover:scale-105 active:scale-95 transition-all">Get Started</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Main */}
          <div className="lg:col-span-2 space-y-4">
            {/* Profile Header — matches mockup */}
            <div className="bg-li-surface rounded-2xl border border-li-border p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="relative flex-shrink-0">
                  <div className="w-20 h-20 bg-li-surface-3 rounded-full flex items-center justify-center text-3xl font-bold border border-li-border">{profile.name[0]}</div>
                  {profile.verification_level !== "basic" && (
                    <div className="absolute -bottom-1 -right-1 badge-pulse rounded-full bg-li-black">
                      <VerificationBadge level={profile.verification_level} size={20} />
                    </div>
                  )}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <h1 className="text-xl font-bold">{profile.name}</h1>
                    {profile.trust_score > 25 && (
                      <div className="w-4 h-4 bg-li-white rounded-full flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-li-black" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-li-gray">{profile.headline || "Professional"}</p>
                  {profile.location && <p className="text-xs text-li-gray mt-0.5">{profile.location}</p>}
                  <p className="text-[10px] text-li-gray mt-0.5">@{profile.lockedin_id}</p>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-4 gap-3 mt-5 pt-5 border-t border-li-border">
                <div className="text-center">
                  <div className="text-xl font-black">{profile.trust_score}<span className="text-[10px] text-li-gray font-normal">/100</span></div>
                  <div className="w-full h-1 bg-li-surface-3 rounded-full mt-1"><div className="h-full bg-li-white rounded-full score-bar-fill" style={{ "--score-width": `${profile.trust_score}%` } as React.CSSProperties}></div></div>
                  <p className="text-[9px] text-li-gray mt-0.5">Score</p>
                </div>
                <div className="text-center"><div className="text-xl font-bold">{profile.profile_views}</div><p className="text-[9px] text-li-gray">Views</p></div>
                <div className="text-center"><div className="text-xl font-bold">—</div><p className="text-[9px] text-li-gray">Connections</p></div>
                <div className="text-center"><div className="text-xl font-bold">{profile.claims.length}</div><p className="text-[9px] text-li-gray">Proofs</p></div>
              </div>

              {/* Tabs */}
              <div className="flex gap-4 mt-5 border-t border-li-border pt-4 overflow-x-auto">
                {tabList.map((t) => (
                  <button key={t} onClick={() => setTab(t.toLowerCase())}
                    className={`text-xs font-semibold whitespace-nowrap pb-1 transition-all hover:-translate-y-0.5 active:scale-95 ${tab === t.toLowerCase() ? "text-li-white border-b border-li-white" : "text-li-gray hover:text-li-gray-light"}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* About */}
            {(tab === "overview") && profile.about && (
              <div className="bg-li-surface rounded-2xl border border-li-border p-5 fade-in">
                <h3 className="font-bold text-sm mb-2">About</h3>
                <p className="text-xs text-li-gray-light leading-relaxed">{profile.about}</p>
              </div>
            )}

            {/* Experience */}
            {(tab === "overview" || tab === "experience") && profile.experiences.length > 0 && (
              <div className="bg-li-surface rounded-2xl border border-li-border p-5 fade-in">
                <h3 className="font-bold text-sm mb-3">Experience</h3>
                {profile.experiences.map((exp) => (
                  <div key={exp.id} className="flex items-start gap-3 mb-3 last:mb-0 pb-3 last:pb-0 border-b last:border-0 border-li-border">
                    <div className="w-9 h-9 bg-li-surface-3 rounded-lg flex items-center justify-center text-xs font-bold border border-li-border flex-shrink-0">{exp.company[0]}</div>
                    <div>
                      <h4 className="font-semibold text-xs">{exp.title} {exp.is_verified && <span className="text-li-gray-light">· Verified</span>}</h4>
                      <p className="text-[10px] text-li-gray">{exp.company} · {exp.employment_type}</p>
                      <p className="text-[10px] text-li-gray">{exp.start_date} – {exp.end_date || "Present"}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Skills — Verified Skill Pills */}
            {(tab === "overview" || tab === "skills") && profile.skills.length > 0 && (
              <div className="bg-li-surface rounded-2xl border border-li-border p-5 fade-in">
                <h3 className="font-bold text-sm mb-3">Skills</h3>
                <div className="flex flex-wrap gap-1.5">
                  {profile.skills.map((s) => (
                    <span key={s.id} className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${s.is_verified ? "border-li-white text-li-white" : "border-li-border text-li-gray"}`}>
                      {s.is_verified && "✓ "}{s.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Proofs */}
            {(tab === "overview" || tab === "proofs") && profile.claims.length > 0 && (
              <div className="bg-li-surface rounded-2xl border border-li-border p-5 fade-in">
                <h3 className="font-bold text-sm mb-3">Verified Proofs</h3>
                {profile.claims.map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-3 bg-li-surface-2 rounded-xl border border-li-border mb-2 last:mb-0">
                    <div>
                      <p className="text-xs font-semibold">{c.title}</p>
                      <p className="text-[10px] text-li-gray capitalize">{c.type}{c.credential_id ? ` · ${c.credential_id}` : ""}</p>
                    </div>
                    <span className="text-[10px] font-semibold text-li-white border border-li-white px-2 py-0.5 rounded-full">Verified</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Score */}
            <div className="bg-li-surface rounded-2xl border border-li-border p-5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-li-gray uppercase tracking-wider font-semibold">Verification Score</span>
              </div>
              <div className="text-3xl font-black text-center my-2">{profile.trust_score}<span className="text-sm text-li-gray font-normal">/100</span></div>
              <div className="w-full h-1.5 bg-li-surface-3 rounded-full overflow-hidden">
                <div className="h-full bg-li-white rounded-full score-bar-fill" style={{ "--score-width": `${profile.trust_score}%` } as React.CSSProperties}></div>
              </div>
              <p className="text-[10px] text-li-gray text-center mt-2">{levelLabels[profile.verification_level] || "Basic Verified"}</p>
            </div>

            {/* Links */}
            <div className="bg-li-surface rounded-2xl border border-li-border p-5">
              <h3 className="font-bold text-xs mb-3">Professional Links</h3>
              {[
                { label: "LinkedIn", url: profile.linkedin_url },
                { label: "GitHub", url: profile.github_url },
                { label: "Portfolio", url: profile.portfolio_url },
              ].filter(l => l.url).map((l) => (
                <a key={l.label} href={l.url!} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[10px] text-li-gray-light hover:text-li-white py-1.5 hover:translate-x-1 active:scale-95 transition-all">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                  {l.label}
                </a>
              ))}
            </div>

            {/* Top Proofs */}
            {profile.claims.length > 0 && (
              <div className="bg-li-surface rounded-2xl border border-li-border p-5">
                <h3 className="font-bold text-xs mb-3">Top Proofs</h3>
                {profile.claims.slice(0, 3).map((c) => (
                  <div key={c.id} className="flex items-center justify-between py-1.5 border-b border-li-border last:border-0">
                    <span className="text-[10px]">{c.title}</span>
                    <span className="text-[9px] text-li-gray-light font-semibold">Verified</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Watermark footer — matches mockup */}
      <div className="text-center py-6">
        <LogoFull size={18} className="justify-center mb-2" />
        <p className="text-[10px] text-li-gray">Verified by Locked<span className="font-bold">in</span> — Proof Over Claims.</p>
      </div>
    </div>
  );
}
