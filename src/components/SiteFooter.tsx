import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="no-print mt-auto border-t border-border/60">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-400 flex flex-col sm:flex-row gap-3 justify-between">
        <p>© {new Date().getFullYear()} GymQR Guide — Pitch-ready for Montréal gyms.</p>
        <div className="flex gap-4">
          <Link href="/scan" className="hover:text-cyan-300">
            Member scan
          </Link>
          <Link href="/admin" className="hover:text-cyan-300">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
