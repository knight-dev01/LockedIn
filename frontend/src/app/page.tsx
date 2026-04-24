"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PadlockLogo, LogoFull, BadgeBasic, BadgeIdentity, BadgeProof, BadgeElite } from "@/components/ui";

const PROS = [
  { name: "Alex Morgan", role: "Senior Full Stack Developer", company: "DevTeam Labs", score: 92, skills: ["JavaScript", "React", "Node.js"] },
  { name: "Sarah Chen", role: "Product Designer", company: "Design Studio", score: 90, skills: ["UI/UX", "Figma", "Design System"] },
  { name: "Rohan Patel", role: "Data Scientist", company: "DataCore", score: 88, skills: ["Python", "ML", "SQL"] },
  { name: "Maria Gomez", role: "Cybersecurity Analyst", company: "CyberSafe", score: 87, skills: ["Python", "Security", "Cloud"] },
  { name: "David Lee", role: "Backend Developer", company: "Stripe", score: 85, skills: ["Go", "PostgreSQL", "AWS"] },
  { name: "Chioma Okafor", role: "Mobile Developer", company: "Paystack", score: 84, skills: ["Flutter", "Dart", "Firebase"] },
];

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen bg-li-black text-li-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-black/70 backdrop-blur-md border-b border-li-border">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
          <Link href="/" className="hover:opacity-80 active:scale-95 transition-all"><LogoFull size={24} /></Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-li-gray-light">
            <a href="#how" className="hover:text-li-white hover:-translate-y-0.5 active:scale-95 transition-all">How It Works</a>
            <a href="#pros" className="hover:text-li-white hover:-translate-y-0.5 active:scale-95 transition-all">Professionals</a>
            <a href="#levels" className="hover:text-li-white hover:-translate-y-0.5 active:scale-95 transition-all">Verification</a>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-sm text-li-gray-light hover:text-li-white hover:-translate-y-0.5 active:scale-95 transition-all">Log In</Link>
            <Link href="/register" className="bg-li-white text-li-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-li-text hover:scale-105 active:scale-95 transition-all shadow-lg shadow-white/5">Get Started</Link>
          </div>
          <button className="md:hidden p-2 text-li-white active:scale-90 transition-transform" onClick={() => setMobileNav(!mobileNav)}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d={mobileNav ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
        {mobileNav && (
          <div className="md:hidden px-4 pb-4 border-t border-li-border pt-3 space-y-3 fade-in">
            <a href="#how" className="block text-sm text-li-gray-light">How It Works</a>
            <a href="#pros" className="block text-sm text-li-gray-light">Professionals</a>
            <a href="#levels" className="block text-sm text-li-gray-light">Verification</a>
            <div className="flex gap-3 pt-2">
              <Link href="/login" className="text-sm text-li-gray-light">Log In</Link>
              <Link href="/register" className="bg-li-white text-li-black px-5 py-2 rounded-full text-sm font-semibold">Get Started</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero — matches mockup: large "Proof Over Claims." */}
      <section className="max-w-6xl mx-auto px-4 pt-16 sm:pt-24 pb-16 sm:pb-24">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md rounded-full px-4 py-1.5 mb-6 border border-white/10">
            <BadgeProof size={14} />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-li-gray-light">A network built on proof, not claims</span>
          </div>
          <h1 className={`text-5xl sm:text-6xl lg:text-8xl font-black tracking-tight leading-[0.9] mb-6 ${mounted ? "slide-up" : "opacity-0"}`}>
            <span className="shimmer-text">Proof Over<br />Claims.</span>
          </h1>
          <p className={`text-base sm:text-lg text-li-gray-light max-w-xl mb-8 leading-relaxed ${mounted ? "fade-in" : "opacity-0"}`}>
            A professional network where achievements are verified, not assumed. Build trust through proof. Get discovered by employers who value real credentials.
          </p>
          <div className={`flex flex-col sm:flex-row gap-3 ${mounted ? "fade-in" : "opacity-0"}`}>
            <Link href="/register"
              className="bg-li-white text-li-black px-8 py-3.5 rounded-full text-sm font-bold text-center hover:bg-li-text hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10">
              Explore &amp; Get Verified →
            </Link>
            <Link href="/search"
              className="border border-li-border text-li-white px-8 py-3.5 rounded-full text-sm font-semibold text-center hover:border-li-gray hover:scale-105 active:scale-95 transition-all">
              View Certified Professionals
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Professionals — matches mockup card layout */}
      <section id="pros" className="relative py-16 sm:py-20 border-t border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl sm:text-2xl font-bold">Featured Verified Professionals</h2>
            <Link href="/search" className="text-sm text-li-gray-light hover:text-li-white hover:translate-x-1 active:scale-95 transition-all">View All →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {PROS.map((p) => (
              <div key={p.name} className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:border-white/30 hover:-translate-y-1.5 active:scale-[0.98] hover:shadow-[0_8px_30px_rgba(255,255,255,0.08)] transition-all duration-300 cursor-pointer group">
                <div className="relative w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-2 group-hover:bg-li-white group-hover:text-li-black transition-colors">
                  {p.name[0]}
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-li-white rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-li-black" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <h3 className="font-semibold text-xs text-center truncate">{p.name}</h3>
                <p className="text-[10px] text-li-gray text-center truncate">{p.role}</p>
                <p className="text-[10px] text-li-gray text-center mb-2">{p.score}/100</p>
                <div className="flex flex-wrap gap-0.5 justify-center">
                  {p.skills.map((s) => (
                    <span key={s} className="text-[8px] sm:text-[9px] bg-li-border text-li-gray-light px-1.5 py-0.5 rounded-full">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-12">How Locked<span className="font-black">in</span> Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: "1", title: "Upload Proof", desc: "Add certificates, repositories, projects, or any verifiable evidence of your work.", icon: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" },
              { n: "2", title: "Get Verified", desc: "Our verification engine and peer reviewers validate your claims through real proof.", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
              { n: "3", title: "Get Discovered", desc: "Stand out to employers and connections who value proof, skills, and real results.", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
            ].map((item) => (
              <div key={item.n} className="text-center group hover:-translate-y-1 transition-transform duration-300">
                <div className="w-14 h-14 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:border-white/30 group-hover:bg-white/10 transition-colors">
                  <svg className="w-6 h-6 text-li-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </div>
                <h3 className="font-bold text-sm mb-2">{item.n}. {item.title}</h3>
                <p className="text-sm text-li-gray max-w-xs mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verification Levels — matches mockup badge system */}
      <section id="levels" className="relative py-16 sm:py-20 border-t border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-4">Verification Badge System</h2>
          <p className="text-sm text-li-gray text-center mb-10 max-w-lg mx-auto">Consistent stroke weight and scalable icons. Your trust score unlocks higher verification levels.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { level: "Basic Verified", range: "0–25", badge: <BadgeBasic size={32} /> },
              { level: "Identity Verified", range: "26–50", badge: <BadgeIdentity size={32} /> },
              { level: "Proof Verified", range: "51–75", badge: <BadgeProof size={32} /> },
              { level: "Elite Professional", range: "76–100", badge: <div className="badge-pulse rounded-full"><BadgeElite size={32} /></div> },
            ].map((l) => (
              <div key={l.level} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center shadow-lg">
                <div className="flex justify-center mb-3">{l.badge}</div>
                <h3 className="font-bold text-xs mb-1">{l.level}</h3>
                <p className="text-[10px] text-li-gray">Score: {l.range}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-8 sm:p-12 text-center">
            <LogoFull size={48} className="justify-center mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Join a network built on proof, not claims.</h2>
            <p className="text-li-gray mb-8 text-sm">Be verified. Build trust. Get discovered.</p>
            <Link href="/register" className="inline-block bg-li-white text-li-black px-8 py-3.5 rounded-full text-sm font-bold hover:bg-li-text hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10">
              Create Your Profile →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer — Watermark */}
      <footer className="border-t border-li-border py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <LogoFull size={20} />
            <span className="text-xs text-li-gray">Proof Over Claims.</span>
          </div>
          <p className="text-[10px] text-li-gray">© 2026 LockedIn. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
