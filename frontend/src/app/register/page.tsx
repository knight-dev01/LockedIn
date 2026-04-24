"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogoFull } from "@/components/ui";
import { authAPI } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({ name: "", email: "", password: "", headline: "", location: "", linkedin_url: "", github_url: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) { setStep(2); return; }
    setError(""); setLoading(true);
    try { const res = await authAPI.register(form); setAuth(res.data.user, res.data.access_token); router.push("/dashboard"); }
    catch (err: any) { setError(err.response?.data?.detail || "Registration failed."); }
    finally { setLoading(false); }
  };

  const inp = "w-full px-4 py-3 bg-li-surface-2 border border-li-border rounded-xl text-sm text-li-white placeholder-li-gray focus:outline-none focus:border-li-white transition-colors";

  return (
    <div className="min-h-screen flex items-center justify-center bg-li-black px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex justify-center mb-6 hover:opacity-80 active:scale-95 transition-all">
            <LogoFull size={32} />
          </Link>
          <h1 className="text-xl font-bold mb-1">Get Verified</h1>
          <p className="text-sm text-li-gray">Create your proof-based professional profile</p>
          <div className="flex items-center gap-2 justify-center mt-4">
            <div className={`h-1 w-10 rounded-full ${step >= 1 ? "bg-li-white" : "bg-li-border"}`}></div>
            <div className={`h-1 w-10 rounded-full ${step >= 2 ? "bg-li-white" : "bg-li-border"}`}></div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-6">
          {error && <div className="bg-red-950/30 backdrop-blur-md text-red-400 text-sm px-4 py-3 rounded-xl mb-4 border border-red-900/50">{error}</div>}
          {step === 1 && (
            <>
              <div className="mb-4"><label className="block text-xs font-semibold mb-2 text-li-gray-light">Full Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-sm text-li-white placeholder-li-gray focus:outline-none focus:border-li-white transition-colors" placeholder="John Doe" required /></div>
              <div className="mb-4"><label className="block text-xs font-semibold mb-2 text-li-gray-light">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-sm text-li-white placeholder-li-gray focus:outline-none focus:border-li-white transition-colors" placeholder="you@company.com" required /></div>
              <div className="mb-4"><label className="block text-xs font-semibold mb-2 text-li-gray-light">Password</label>
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-sm text-li-white placeholder-li-gray focus:outline-none focus:border-li-white transition-colors" placeholder="Min. 6 characters" required minLength={6} /></div>
              <div className="mb-6"><label className="block text-xs font-semibold mb-2 text-li-gray-light">Professional Headline</label>
                <input type="text" value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-sm text-li-white placeholder-li-gray focus:outline-none focus:border-li-white transition-colors" placeholder="e.g. Senior Full Stack Developer" /></div>
            </>
          )}
          {step === 2 && (
            <>
              <p className="text-xs text-li-gray mb-4">Link your professional profiles. We&apos;ll scrape public data to validate your claims.</p>
              <div className="mb-4"><label className="block text-xs font-semibold mb-2 text-li-gray-light">LinkedIn URL</label>
                <input type="url" value={form.linkedin_url} onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })} className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-sm text-li-white placeholder-li-gray focus:outline-none focus:border-li-white transition-colors" placeholder="https://linkedin.com/in/you" /></div>
              <div className="mb-4"><label className="block text-xs font-semibold mb-2 text-li-gray-light">GitHub URL</label>
                <input type="url" value={form.github_url} onChange={(e) => setForm({ ...form, github_url: e.target.value })} className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-sm text-li-white placeholder-li-gray focus:outline-none focus:border-li-white transition-colors" placeholder="https://github.com/you" /></div>
              <div className="mb-6"><label className="block text-xs font-semibold mb-2 text-li-gray-light">Location</label>
                <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-sm text-li-white placeholder-li-gray focus:outline-none focus:border-li-white transition-colors" placeholder="Lagos, Nigeria" /></div>
            </>
          )}
          <div className="flex gap-3">
            {step === 2 && <button type="button" onClick={() => setStep(1)} className="flex-1 border border-li-border text-li-gray-light py-3 rounded-xl text-sm font-bold hover:border-li-white hover:text-li-white active:scale-95 transition-all">Back</button>}
            <button type="submit" disabled={loading} className="flex-1 bg-li-white text-li-black py-3 rounded-xl text-sm font-bold hover:bg-li-text hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50">
              {step === 1 ? "Next →" : loading ? "Creating..." : "Create Profile"}
            </button>
          </div>
          <p className="text-center text-xs text-li-gray mt-5">Already verified? <Link href="/login" className="text-li-white font-semibold hover:underline active:opacity-70">Sign In</Link></p>
        </form>
      </div>
    </div>
  );
}
