import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const features = [
  {
    title: "Scan → Learn in seconds",
    fr: "Scannez → apprenez en secondes",
    body: "Members point their phone at a machine QR and get clear EN/FR steps, tips, and safety warnings — no app download.",
  },
  {
    title: "Staff-ready admin",
    fr: "Admin prêt pour le staff",
    body: "CRUD machines, download individual QRs, print a full QR sheet for the floor. Multi-tenant gym branding built in.",
  },
  {
    title: "Bilingual by default",
    fr: "Bilingue par défaut",
    body: "English + French content on every seeded machine. Perfect for Montréal and bilingual members.",
  },
  {
    title: "Insight lite",
    fr: "Analytique légère",
    body: "View counts per machine and member issue reports so trainers know what needs attention.",
  },
];

const steps = [
  { n: "1", t: "Stick QR codes on machines", d: "Print from admin — one token URL per machine." },
  { n: "2", t: "Members scan on the floor", d: "Camera scan or manual code. Instant how-to guide." },
  { n: "3", t: "Staff keep guides fresh", d: "Update steps anytime. Track views & issues." },
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="mx-auto max-w-6xl px-4 pt-14 pb-10">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="badge mb-4">B2B · Montréal-ready · EN + FR</span>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
                Every machine gets a{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-300">
                  clear how-to
                </span>
                — via QR.
              </h1>
              <p className="mt-5 text-lg text-slate-300 max-w-xl">
                GymQR Guide helps gyms reduce trainer interruptions, onboard new members faster, and keep
                form safe — without another native app.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/scan" className="btn btn-primary">
                  Try member scan
                </Link>
                <Link href="/admin/login" className="btn btn-secondary">
                  Open staff demo
                </Link>
              </div>
              <p className="mt-4 text-sm text-slate-400">
                Demo login: <code className="text-cyan-300">admin@demofitness.ca</code> /{" "}
                <code className="text-cyan-300">demo1234</code>
              </p>
            </div>

            <div className="card p-6 relative overflow-hidden">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-cyan-400/10 blur-2xl" />
              <p className="text-xs uppercase tracking-widest text-cyan-300/80 mb-3">Live preview</p>
              <div className="rounded-xl border border-border bg-slate-950/60 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-slate-400">Demo Fitness Montréal</p>
                    <h3 className="text-xl font-semibold">Lat Pulldown</h3>
                  </div>
                  <span className="badge">Back</span>
                </div>
                <ol className="space-y-2 text-sm text-slate-300">
                  <li className="flex gap-3">
                    <span className="text-cyan-300 font-mono">01</span>
                    Adjust the thigh pad so your legs are firmly locked…
                  </li>
                  <li className="flex gap-3">
                    <span className="text-cyan-300 font-mono">02</span>
                    Grip the bar slightly wider than shoulder-width…
                  </li>
                  <li className="flex gap-3">
                    <span className="text-cyan-300 font-mono">03</span>
                    Pull to upper chest — elbows down and back…
                  </li>
                </ol>
                <div className="mt-5 flex gap-2">
                  <span className="badge !bg-violet-400/10 !text-violet-300 !border-violet-400/25">EN</span>
                  <span className="badge !bg-violet-400/10 !text-violet-300 !border-violet-400/25">FR</span>
                  <span className="badge !bg-amber-400/10 !text-amber-200 !border-amber-400/25">Tips + warnings</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10">
          <h2 className="text-2xl font-semibold mb-6">How it works</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {steps.map((s) => (
              <div key={s.n} className="card p-5">
                <div className="text-cyan-300 font-mono text-sm mb-2">Step {s.n}</div>
                <h3 className="font-semibold text-lg">{s.t}</h3>
                <p className="text-slate-400 mt-2 text-sm">{s.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10">
          <h2 className="text-2xl font-semibold mb-6">Why gym owners care</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {features.map((f) => (
              <div key={f.title} className="card p-5">
                <h3 className="font-semibold text-lg">{f.title}</h3>
                <p className="text-xs text-cyan-300/80 mt-1">{f.fr}</p>
                <p className="text-slate-400 mt-3 text-sm leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12">
          <div className="card p-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold">Pitch-ready for Montréal gyms</h2>
            <p className="mt-3 text-slate-300 max-w-2xl mx-auto">
              Seeded with <strong>Demo Fitness Montréal</strong> and 10 bilingual machine guides. Show a
              owner the scan flow and the printable QR sheet in under five minutes.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/admin/login" className="btn btn-primary">
                Launch admin demo
              </Link>
              <Link href="/scan" className="btn btn-secondary">
                Open scanner
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
