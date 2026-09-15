"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { QrScanner } from "@/components/QrScanner";
import { WorkoutTracker } from "@/components/WorkoutTracker";

type MachineRow = {
  id: string;
  token: string;
  nameEn: string;
  nameFr: string;
  category: string;
  slug: string;
};

type Tab = "machines" | "workout";
type MachineMode = "browse" | "scan" | "code";

type Props = {
  gym: {
    name: string;
    tagline: string | null;
    city: string | null;
    primaryColor: string;
    slug: string;
  };
  machines: MachineRow[];
  initialTab?: Tab;
};

export function GymHome({ gym, machines, initialTab = "machines" }: Props) {
  const [lang, setLang] = useState<"en" | "fr">("en");
  const [tab, setTab] = useState<Tab>(initialTab === "workout" ? "workout" : "machines");
  const [mode, setMode] = useState<MachineMode>("browse");

  const t = useMemo(
    () =>
      lang === "fr"
        ? {
            welcome: "Bienvenue",
            subtitle: "Scannez un QR ou choisissez une machine pour voir le guide.",
            subtitleWorkout: "Enregistrez vos séries et cardio sur les machines du gym.",
            scan: "Scanner une machine",
            enterCode: "Entrer un code",
            browse: "Machines",
            workout: "Séance",
            back: "Retour",
            staff: "Espace staff",
            empty: "Aucune machine active pour le moment.",
          }
        : {
            welcome: "Welcome",
            subtitle: "Scan a QR or pick a machine to open its how-to guide.",
            subtitleWorkout: "Log sets and cardio using this gym’s machines.",
            scan: "Scan a machine",
            enterCode: "Enter code",
            browse: "Machines",
            workout: "Workout",
            back: "Back",
            staff: "Staff",
            empty: "No active machines yet.",
          },
    [lang]
  );

  function goTab(next: Tab) {
    setTab(next);
    if (next === "machines") setMode("browse");
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8 w-full flex-1">
      <header className="mb-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold border"
              style={{
                backgroundColor: `${gym.primaryColor}22`,
                color: gym.primaryColor,
                borderColor: `${gym.primaryColor}55`,
              }}
            >
              DF
            </span>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wider text-slate-400">{t.welcome}</p>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">{gym.name}</h1>
              {(gym.tagline || gym.city) && (
                <p className="text-sm text-slate-400 mt-1">
                  {gym.tagline}
                  {gym.tagline && gym.city ? " · " : ""}
                  {gym.city}
                </p>
              )}
            </div>
          </div>
          <div className="flex rounded-xl border border-border overflow-hidden text-sm font-semibold shrink-0">
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`px-2.5 py-1.5 ${lang === "en" ? "bg-cyan-400 text-slate-950" : "bg-slate-900 text-slate-300"}`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang("fr")}
              className={`px-2.5 py-1.5 ${lang === "fr" ? "bg-cyan-400 text-slate-950" : "bg-slate-900 text-slate-300"}`}
            >
              FR
            </button>
          </div>
        </div>
        <p className="mt-4 text-slate-300">
          {tab === "workout" ? t.subtitleWorkout : t.subtitle}
        </p>
      </header>

      <nav
        className="mb-6 flex rounded-xl border border-border overflow-hidden text-sm font-semibold"
        aria-label="Member sections"
      >
        <button
          type="button"
          onClick={() => goTab("machines")}
          className={`flex-1 py-3 min-h-[48px] ${
            tab === "machines" ? "bg-cyan-400 text-slate-950" : "bg-slate-900 text-slate-300"
          }`}
        >
          {t.browse}
        </button>
        <button
          type="button"
          onClick={() => goTab("workout")}
          className={`flex-1 py-3 min-h-[48px] ${
            tab === "workout" ? "bg-cyan-400 text-slate-950" : "bg-slate-900 text-slate-300"
          }`}
        >
          {t.workout}
        </button>
      </nav>

      {tab === "machines" && mode === "browse" && (
        <>
          <div className="grid grid-cols-2 gap-3 mb-8">
            <button
              type="button"
              onClick={() => setMode("scan")}
              className="btn btn-primary !py-3"
              style={{
                background: `linear-gradient(135deg, ${gym.primaryColor}, #0891b2)`,
              }}
            >
              {t.scan}
            </button>
            <button type="button" onClick={() => setMode("code")} className="btn btn-secondary !py-3">
              {t.enterCode}
            </button>
          </div>

          <section>
            <h2 className="font-semibold mb-3 text-slate-200">
              {t.browse}
              <span className="text-slate-500 font-normal text-sm ml-2">({machines.length})</span>
            </h2>
            {machines.length === 0 ? (
              <p className="text-slate-400 text-sm">{t.empty}</p>
            ) : (
              <ul className="space-y-2">
                {machines.map((m) => (
                  <li key={m.id}>
                    <Link
                      href={`/q/${m.token}`}
                      className="card px-4 py-3 flex items-center justify-between gap-3 hover:border-cyan-400/40 transition"
                    >
                      <span className="min-w-0">
                        <span className="font-medium block truncate">
                          {lang === "fr" ? m.nameFr : m.nameEn}
                        </span>
                        <span className="text-slate-500 text-sm truncate block">
                          {lang === "fr" ? m.nameEn : m.nameFr}
                        </span>
                      </span>
                      <span className="badge shrink-0">{m.category}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}

      {tab === "machines" && mode === "scan" && (
        <section>
          <button
            type="button"
            onClick={() => setMode("browse")}
            className="text-sm text-slate-400 hover:text-cyan-300 mb-4"
          >
            ← {t.back}
          </button>
          <h2 className="text-xl font-semibold mb-4">{t.scan}</h2>
          <QrScanner />
        </section>
      )}

      {tab === "machines" && mode === "code" && (
        <section>
          <button
            type="button"
            onClick={() => setMode("browse")}
            className="text-sm text-slate-400 hover:text-cyan-300 mb-4"
          >
            ← {t.back}
          </button>
          <h2 className="text-xl font-semibold mb-4">{t.enterCode}</h2>
          <CodeEntry />
        </section>
      )}

      {tab === "workout" && (
        <WorkoutTracker
          gymSlug={gym.slug}
          primaryColor={gym.primaryColor}
          lang={lang}
          machines={machines.map((m) => ({
            id: m.id,
            nameEn: m.nameEn,
            nameFr: m.nameFr,
            category: m.category,
          }))}
        />
      )}

      <p className="mt-10 text-center text-xs text-slate-500">
        <Link href="/admin/login" className="hover:text-slate-300 underline-offset-2 hover:underline">
          {t.staff}
        </Link>
      </p>
    </div>
  );
}

function CodeEntry() {
  const router = useRouter();
  const [manual, setManual] = useState("");
  const [error, setError] = useState<string | null>(null);

  function extractToken(raw: string): string | null {
    const text = raw.trim();
    try {
      const url = new URL(text);
      const parts = url.pathname.split("/").filter(Boolean);
      const qi = parts.indexOf("q");
      if (qi >= 0 && parts[qi + 1]) return parts[qi + 1];
      const mi = parts.indexOf("m");
      if (mi >= 0 && parts[mi + 1] && parts[mi + 2]) {
        return `slug:${parts[mi + 1]}/${parts[mi + 2]}`;
      }
    } catch {
      // bare token
    }
    if (/^[a-f0-9]{12,}$/i.test(text)) return text;
    return null;
  }

  function go(e: React.FormEvent) {
    e.preventDefault();
    const token = extractToken(manual);
    if (!token) {
      setError("Enter a machine token or full /q/… URL.");
      return;
    }
    if (token.startsWith("slug:")) router.push(`/m/${token.slice(5)}`);
    else router.push(`/q/${token}`);
  }

  return (
    <form onSubmit={go} className="card p-5 space-y-3">
      <p className="text-sm text-slate-400">Paste a QR link, or type the machine token from the sticker.</p>
      <input
        className="input"
        value={manual}
        onChange={(e) => setManual(e.target.value)}
        placeholder="https://…/q/abc123 or token"
        autoFocus
      />
      {error && <p className="text-sm text-amber-200">{error}</p>}
      <button type="submit" className="btn btn-primary w-full">
        Open guide
      </button>
    </form>
  );
}
