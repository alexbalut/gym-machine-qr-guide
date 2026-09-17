import Link from "next/link";

/** Compact chrome for member/scan flows — not a sales header. */
export function SiteHeader({ compact = false }: { compact?: boolean }) {
  return (
    <header className="no-print border-b border-border sticky top-0 z-40 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-navy">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)] border border-[#d8e6f8] text-sm font-bold">
            QR
          </span>
          <span>Machines</span>
        </Link>
        {!compact && (
          <nav className="flex items-center gap-3 text-sm text-muted">
            <Link href="/" className="hover:text-[var(--accent)]">
              Home
            </Link>
            <Link href="/scan" className="hover:text-[var(--accent)]">
              Scan
            </Link>
            <Link href="/admin/login" className="text-xs text-muted hover:text-navy">
              Staff
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
