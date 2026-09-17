import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="no-print mt-auto border-t border-border bg-[#F3F3F3]">
      <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-muted flex flex-col sm:flex-row gap-3 justify-between">
        <p>Demo Fitness Montréal · Machine guides</p>
        <div className="flex gap-4">
          <Link href="/" className="hover:text-[var(--accent)]">
            Home
          </Link>
          <Link href="/admin/login" className="hover:text-navy text-xs self-center">
            Staff
          </Link>
        </div>
      </div>
    </footer>
  );
}
