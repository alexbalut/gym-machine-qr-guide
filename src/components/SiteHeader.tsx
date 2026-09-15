import Link from "next/link";

export function SiteHeader({ compact = false }: { compact?: boolean }) {
  return (
    <header className="no-print border-b border-border/80 backdrop-blur sticky top-0 z-40 bg-[#070b14]/70">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/15 text-cyan-300 border border-cyan-400/30 text-sm">
            QR
          </span>
          <span>
            GymQR <span className="text-cyan-300">Guide</span>
          </span>
        </Link>
        {!compact && (
          <nav className="flex items-center gap-2 sm:gap-3 text-sm">
            <Link href="/scan" className="btn btn-secondary !py-2 !px-3">
              Scan
            </Link>
            <Link href="/admin/login" className="btn btn-primary !py-2 !px-3">
              Staff login
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
