"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import { notificationsAPI } from "@/lib/api";
import { Notification } from "@/lib/types";
import { LogoFull, BottomNav } from "@/components/ui";

export default function NotificationsPage() {
  const router = useRouter();
  const { user, loadUser, isLoading } = useAuthStore();
  const [notifs, setNotifs] = useState<Notification[]>([]);

  useEffect(() => { loadUser(); }, []);
  useEffect(() => { if (!isLoading && !user) router.push("/login"); }, [isLoading, user]);
  useEffect(() => { if (user) notificationsAPI.getAll().then((r) => setNotifs(r.data)).catch(() => {}); }, [user]);

  const markRead = async (id: string) => {
    await notificationsAPI.markRead(id);
    setNotifs((p) => p.map((n) => n.id === id ? { ...n, is_read: true } : n));
  };

  const iconMap: Record<string, string> = {
    verification: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    connection: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
    profile_view: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
  };
  const fallbackIcon = "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9";

  if (isLoading || !user) return <div className="min-h-screen flex items-center justify-center bg-li-black"><div className="w-8 h-8 border-2 border-li-white border-t-transparent rounded-full animate-spin"></div></div>;

  const today = new Date().toDateString();
  const todayN = notifs.filter((n) => new Date(n.created_at || "").toDateString() === today);
  const olderN = notifs.filter((n) => new Date(n.created_at || "").toDateString() !== today);

  const renderItem = (n: Notification) => (
    <div key={n.id} onClick={() => markRead(n.id)}
      className={`flex items-start gap-3 p-3 rounded-xl mb-1.5 cursor-pointer transition-all active:scale-[0.98] hover:border-white/30 ${n.is_read ? "bg-white/5 backdrop-blur-sm border border-transparent" : "bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_4px_20px_rgba(255,255,255,0.05)]"}`}>
      <div className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center flex-shrink-0 border border-white/10">
        <svg className="w-3.5 h-3.5 text-li-gray-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d={iconMap[n.type] || fallbackIcon} />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold">{n.title}</p>
        <p className="text-[10px] text-li-gray truncate">{n.message}</p>
      </div>
      {!n.is_read && <div className="w-1.5 h-1.5 bg-li-white rounded-full mt-2 flex-shrink-0"></div>}
    </div>
  );

  return (
    <div className="min-h-screen bg-li-black pb-16 md:pb-0">
      <nav className="bg-black/70 backdrop-blur-md border-b border-li-border sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between h-14">
          <Link href="/dashboard" className="hover:opacity-80 active:scale-95 transition-all"><LogoFull size={22} /></Link>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/dashboard" className="text-li-gray hover:text-li-white hover:-translate-y-0.5 transition-all">Home</Link>
            <Link href="/search" className="text-li-gray hover:text-li-white hover:-translate-y-0.5 transition-all">Search</Link>
            <Link href="/network" className="text-li-gray hover:text-li-white hover:-translate-y-0.5 transition-all">Network</Link>
            <span className="text-li-white font-semibold hover:-translate-y-0.5 transition-transform">Notifications</span>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-li-surface rounded-2xl border border-li-border p-5">
          <h2 className="text-lg font-bold mb-5">Notifications</h2>
          {notifs.length === 0 ? (
            <div className="text-center py-12"><p className="text-sm text-li-gray-light">No notifications</p><p className="text-xs text-li-gray mt-1">Verification updates and connection requests will appear here</p></div>
          ) : (
            <>
              {todayN.length > 0 && (<><h3 className="text-[10px] font-semibold text-li-gray uppercase mb-2 tracking-wider">Today</h3>{todayN.map(renderItem)}</>)}
              {olderN.length > 0 && (<><h3 className="text-[10px] font-semibold text-li-gray uppercase mb-2 mt-4 tracking-wider">Earlier</h3>{olderN.map(renderItem)}</>)}
            </>
          )}
        </div>
      </div>
      <BottomNav active="notifs" />
    </div>
  );
}
