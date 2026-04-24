/** LockedIn Logo — Padlock with "in" inside, matching the design system mockup. */

export function PadlockLogo({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="currentColor" className={className}>
      {/* Thick Shackle */}
      <path d="M 28 45 V 36 C 28 23.8 37.8 14 50 14 C 62.2 14 72 23.8 72 36 V 45" stroke="currentColor" strokeWidth="15" fill="none" />
      {/* Rounded Rect Body */}
      <rect x="12" y="42" width="76" height="52" rx="14" fill="currentColor" />
      {/* "in" text punched out in background color */}
      <text x="50" y="80" textAnchor="middle" fill="var(--color-li-black)" fontSize="36" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="-0.5">in</text>
    </svg>
  );
}

export function LogoFull({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <div className={`flex items-center ${className}`} style={{ height: size }}>
      <span className="font-[800] tracking-tight" style={{ fontSize: size * 1.25, marginRight: size * 0.1 }}>Locked</span>
      <PadlockLogo size={size * 1.4} />
    </div>
  );
}

/** Verification Badge Icons — Shield-based, matching the mockup's badge system */

export function BadgeBasic({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 018 0v3" strokeLinecap="round" />
    </svg>
  );
}

export function BadgeIdentity({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
      <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
      <rect x="9" y="11" width="6" height="4" rx="1" />
      <path d="M10 11V9.5a2 2 0 014 0V11" strokeLinecap="round" />
    </svg>
  );
}

export function BadgeProof({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
      <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

export function BadgeElite({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
      <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
      {/* Laurel left */}
      <path d="M7 14c1-2 2-3.5 3-4" strokeLinecap="round" />
      <path d="M7 16c1-1.5 2-2.5 3-3" strokeLinecap="round" />
      {/* Laurel right */}
      <path d="M17 14c-1-2-2-3.5-3-4" strokeLinecap="round" />
      <path d="M17 16c-1-1.5-2-2.5-3-3" strokeLinecap="round" />
      {/* Star */}
      <circle cx="12" cy="11" r="1.5" fill="white" stroke="none" />
    </svg>
  );
}

export function VerificationBadge({ level, size = 16 }: { level: string; size?: number }) {
  switch (level) {
    case "elite": return <BadgeElite size={size} />;
    case "proof_verified": return <BadgeProof size={size} />;
    case "verified_identity": return <BadgeIdentity size={size} />;
    default: return <BadgeBasic size={size} />;
  }
}

export function VerifiedCheck({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="white">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );
}

/** Bottom Navigation — matches the mockup's 5-tab mobile nav */
export function BottomNav({ active }: { active: string }) {
  const tabs = [
    { id: "home", href: "/dashboard", d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { id: "search", href: "/search", d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
    { id: "network", href: "/network", d: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
    { id: "notifs", href: "/notifications", d: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" },
    { id: "profile", href: "/dashboard", d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/70 backdrop-blur-md border-t border-li-border md:hidden z-50 safe-bottom">
      <div className="flex items-center justify-around h-14">
        {tabs.map((t) => (
          <a key={t.id} href={t.href} className={`p-2 rounded-xl hover:bg-li-surface-3 active:scale-90 transition-all duration-200 ${active === t.id ? "text-li-white" : "text-li-gray"}`}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active === t.id ? 2 : 1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={t.d} />
            </svg>
          </a>
        ))}
      </div>
    </nav>
  );
}
