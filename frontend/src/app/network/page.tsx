"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import { connectionsAPI } from "@/lib/api";
import { LogoFull, BottomNav } from "@/components/ui";

export default function NetworkPage() {
  const router = useRouter();
  const { user, loadUser, isLoading } = useAuthStore();
  const [connections, setConnections] = useState<any[]>([]);
  const [tab, setTab] = useState("connections");

  useEffect(() => { loadUser(); }, []);
  useEffect(() => { if (!isLoading && !user) router.push("/login"); }, [isLoading, user]);
  useEffect(() => { if (user) connectionsAPI.getMy().then((r) => setConnections(r.data.connections || [])).catch(() => {}); }, [user]);

  if (isLoading || !user) return <div className="min-h-screen flex items-center justify-center bg-li-black"><div className="w-8 h-8 border-2 border-li-white border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-li-black pb-16 md:pb-0">
      <nav className="bg-black/70 backdrop-blur-md border-b border-li-border sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between h-14">
          <Link href="/dashboard" className="hover:opacity-80 active:scale-95 transition-all"><LogoFull size={22} /></Link>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/dashboard" className="text-li-gray hover:text-li-white hover:-translate-y-0.5 transition-all">Home</Link>
            <Link href="/search" className="text-li-gray hover:text-li-white hover:-translate-y-0.5 transition-all">Search</Link>
            <span className="text-li-white font-semibold hover:-translate-y-0.5 transition-transform">Network</span>
            <Link href="/notifications" className="text-li-gray hover:text-li-white hover:-translate-y-0.5 transition-all">Notifications</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-li-surface rounded-2xl border border-li-border p-5">
          <h2 className="text-lg font-bold mb-1">My Network</h2>
          <p className="text-xs text-li-gray mb-5">{connections.length} connections</p>

          <div className="flex gap-4 border-b border-li-border mb-5">
            {["connections", "following", "followers"].map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`pb-2.5 text-xs font-semibold capitalize transition-all hover:-translate-y-0.5 active:scale-95 ${tab === t ? "text-li-white border-b border-li-white" : "text-li-gray hover:text-li-gray-light"}`}>
                {t}
              </button>
            ))}
          </div>

          {connections.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-li-gray-light mb-2">No connections yet</p>
              <p className="text-xs text-li-gray mb-4">Find verified professionals to connect with</p>
              <Link href="/search" className="inline-block bg-li-white text-li-black px-6 py-2 rounded-full text-xs font-bold hover:scale-105 active:scale-95 transition-all shadow-md shadow-white/5">Search Professionals</Link>
            </div>
          ) : (
            <div className="space-y-2">
              {connections.map((conn: any) => (
                <div key={conn.id} className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4 flex items-center justify-between hover:border-white/30 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(255,255,255,0.05)] active:scale-[0.98] transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center font-bold border border-white/10">{conn.user?.name[0]}</div>
                    <div>
                      <h3 className="font-semibold text-xs">{conn.user?.name}</h3>
                      <p className="text-[10px] text-li-gray">{conn.user?.headline}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-li-gray-light font-semibold">{conn.user?.trust_score}/100</span>
                    <Link href={`/in/${conn.user?.lockedin_id}`} className="border border-li-border px-3 py-1 rounded-full text-[10px] font-semibold text-li-gray-light hover:border-li-white hover:text-li-white hover:scale-105 active:scale-95 transition-all">View</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <BottomNav active="network" />
    </div>
  );
}
