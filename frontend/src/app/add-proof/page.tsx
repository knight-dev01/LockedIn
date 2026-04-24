"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import { claimsAPI } from "@/lib/api";

export default function AddProofPage() {
  const router = useRouter();
  const { user, loadUser, isLoading } = useAuthStore();
  const [form, setForm] = useState({ type: "project", title: "", description: "", credential_id: "", external_url: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { loadUser(); }, []);
  useEffect(() => { if (!isLoading && !user) router.push("/login"); }, [isLoading, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try { await claimsAPI.create(form); setSuccess(true); setTimeout(() => router.push("/dashboard"), 1500); }
    catch (err: any) { setError(err.response?.data?.detail || "Failed to submit proof"); }
    finally { setLoading(false); }
  };

  const inp = "w-full px-4 py-3 bg-li-surface-2 border border-li-border rounded-xl text-sm text-li-white placeholder-li-gray focus:outline-none focus:border-li-white transition-colors";

  if (isLoading || !user) return <div className="min-h-screen flex items-center justify-center bg-li-black"><div className="w-8 h-8 border-2 border-li-white border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-li-black">
      <nav className="bg-black/70 backdrop-blur-md border-b border-li-border sticky top-0 z-50">
        <div className="max-w-xl mx-auto px-4 flex items-center h-14 gap-3">
          <Link href="/dashboard" className="text-li-gray hover:text-li-white p-2 -ml-2 rounded-full hover:bg-li-surface-3 active:scale-90 transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <span className="font-bold text-sm">Add New Proof</span>
        </div>
      </nav>
      <div className="max-w-xl mx-auto px-4 py-6">
        {success ? (
          <div className="bg-li-surface rounded-2xl border border-li-white p-10 text-center fade-in">
            <div className="w-12 h-12 border-2 border-li-white rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-li-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-lg font-bold mb-1">Proof Submitted!</h2>
            <p className="text-xs text-li-gray">Pending verification. Redirecting...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-li-surface rounded-2xl border border-li-border p-5">
            {error && <div className="bg-li-surface-2 text-red-400 text-xs px-4 py-3 rounded-xl mb-4 border border-li-border">{error}</div>}
            <div className="mb-4">
              <label className="block text-xs font-semibold mb-2 text-li-gray-light">Proof Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={inp}>
                <option value="project">Project</option>
                <option value="certification">Certification</option>
                <option value="repository">Repository / Code</option>
                <option value="achievement">Achievement</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-xs font-semibold mb-2 text-li-gray-light">Title</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inp} placeholder="e.g. AWS Certified Solutions Architect" required />
            </div>
            <div className="mb-4">
              <label className="block text-xs font-semibold mb-2 text-li-gray-light">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${inp} h-20 resize-none`} placeholder="Describe your achievement..." />
            </div>
            <div className="mb-4">
              <label className="block text-xs font-semibold mb-2 text-li-gray-light">Credential ID <span className="text-li-gray font-normal">(optional)</span></label>
              <input type="text" value={form.credential_id} onChange={(e) => setForm({ ...form, credential_id: e.target.value })} className={inp} placeholder="e.g. AWS-123456" />
            </div>
            <div className="mb-6">
              <label className="block text-xs font-semibold mb-2 text-li-gray-light">External URL <span className="text-li-gray font-normal">(proof link)</span></label>
              <input type="url" value={form.external_url} onChange={(e) => setForm({ ...form, external_url: e.target.value })} className={inp} placeholder="https://github.com/you/project" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-li-white text-li-black py-3 rounded-xl text-sm font-bold hover:bg-li-text hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50">
              {loading ? "Submitting..." : "Submit Proof"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
