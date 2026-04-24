"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogoFull } from "@/components/ui";
import { authAPI } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setLoading(true);
    try { const res = await authAPI.login(form); setAuth(res.data.user, res.data.access_token); router.push("/dashboard"); }
    catch (err: any) { setError(err.response?.data?.detail || "Login failed."); }
    finally { setLoading(false); }
  };

  const inp = "w-full px-4 py-3 bg-li-surface-2 border border-li-border rounded-xl text-sm text-li-white placeholder-li-gray focus:outline-none focus:border-li-white transition-colors";

  return (
    <div className="min-h-screen flex items-center justify-center bg-li-black px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex justify-center mb-6 hover:opacity-80 active:scale-95 transition-all">
            <LogoFull size={32} />
          </Link>
          <h1 className="text-xl font-bold mb-1">Welcome back</h1>
          <p className="text-sm text-li-gray">Sign in to your verified profile</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-6">
          {error && <div className="bg-red-950/30 backdrop-blur-md text-red-400 text-sm px-4 py-3 rounded-xl mb-4 border border-red-900/50">{error}</div>}
          <div className="mb-4">
            <label className="block text-xs font-semibold mb-2 text-li-gray-light">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-sm text-li-white placeholder-li-gray focus:outline-none focus:border-li-white transition-colors" placeholder="you@example.com" required />
          </div>
          <div className="mb-6">
            <label className="block text-xs font-semibold mb-2 text-li-gray-light">Password</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-sm text-li-white placeholder-li-gray focus:outline-none focus:border-li-white transition-colors" placeholder="••••••••" required />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-li-white text-li-black py-3 rounded-xl text-sm font-bold hover:bg-li-text hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50">
            {loading ? "Signing in..." : "Sign In"}
          </button>
          <p className="text-center text-xs text-li-gray mt-5">
            Don&apos;t have an account? <Link href="/register" className="text-li-white font-semibold hover:underline active:opacity-70">Get Verified</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
