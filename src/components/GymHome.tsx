"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { QrScanner } from "@/components/QrScanner";
import { WorkoutTracker } from "@/components/WorkoutTracker";
import { ProgressDashboard } from "@/components/ProgressDashboard";

type MachineRow = {
  id: string;
  token: string;
  nameEn: string;
  nameFr: string;
  category: string;
  slug: string;
};

type Tab = "machines" | "workout" | "progress";
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
  const [tab, setTab] = useState<Tab>(
    initialTab === "workout" || initialTab === "progress" ? initialTab : "machines"
  );
  const [mode, setMode] = useState<MachineMode>("browse");

  const t = useMemo(
    () =>
      lang === "fr"
        ? {
            welcome: "Bienvenue",
            subtitle: "Scannez un QR ou choisissez une machine pour voir le guide.",
            subtitleWorkout: "Enregistrez vos séries et cardio sur les machines du gym.",
            subtitleProgress: "Suivez vos progrès par machine à partir des séances enregistrées.",
            scan: "Scanner une machine",
            enterCode: "Entrer un code",
            browse: "Machines",
            workout: "Séance",
            progress: "Progrès",
            back: "Retour",
            staff: "Espace staff",
            empty: "Aucune machine active pour le moment.",
          }
        : {
            welcome: "Welcome",
            subtitle: "Scan a QR or pick a machine to open its how-to guide.",
            subtitleWorkout: "Log sets and cardio using this gym’s machines.",
            subtitleProgress: "Track progress per machine from your saved workouts.",
            scan: "Scan a machine",
            enterCode: "Enter code",
            browse: "Machines",
            workout: "Workout",
            progress: "Progress",
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
    <div
      className="mx-auto max-w-xl px-4 py-8 w-full flex-1"
      style={{ ["--accent" as string]: gym.primaryColor, ["--accent-hover" as string]: gym.primaryColor }}
    >
      <header className="mb-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold border"
              style={{
                backgroundColor: `${gym.primaryColor}14`,
                color: gym.primaryColor,
                borderColor: `${gym.primaryColor}33`,
              }}
            >
              DF
            </span>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wider text-muted">{t.welcome}</p>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate text-navy">
                {gym.name}
              </h1>
              {(gym.tagline || gym.city) && (
                <p className="text-sm text-muted mt-1">
                  {gym.tagline}
                  {gym.tagline && gym.city ? " · " : ""}
                  {gym.city}
                </p>
              )}
            </div>
          </div>
          <div className="seg shrink-0" role="group" aria-label="Language">
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`seg-btn ${lang === "en" ? "seg-btn-active" : ""}`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang("fr")}
              className={`seg-btn ${lang === "fr" ? "seg-btn-active" : ""}`}
            >
              FR
            </button>
          </div>
        </div>
        <p className="mt-4 text-body">
          {tab === "workout"
            ? t.subtitleWorkout
            : tab === "progress"
              ? t.subtitleProgress
              : t.subtitle}
        </p>
      </header>

      <nav className="tab-bar mb-6" aria-label="Member sections">
        <button
          type="button"
          onClick={() => goTab("machines")}
          className={`tab-btn ${tab === "machines" ? "tab-btn-active" : ""}`}
        >
          {t.browse}
        </button>
        <button
          type="button"
          onClick={() => goTab("workout")}
          className={`tab-btn ${tab === "workout" ? "tab-btn-active" : ""}`}
        >
          {t.workout}
        </button>
        <button
          type="button"
          onClick={() => goTab("progress")}
          className={`tab-btn ${tab === "progress" ? "tab-btn-active" : ""}`}
        >
          {t.progress}
        </button>
      </nav>

      {tab === "machines" && mode === "browse" && (
        <>
          <div className="grid grid-cols-2 gap-3 mb-8">
            <button
              type="button"
              onClick={() => setMode("scan")}
              className="btn btn-primary !py-3"
              style={{ background: gym.primaryColor }}
            >
              {t.scan}
            </button>
            <button type="button" onClick={() => setMode("code")} className="btn btn-secondary !py-3">
              {t.enterCode}
            </button>
          </div>

          <section>
            <h2 className="font-semibold mb-3 text-navy">
              {t.browse}
              <span className="text-muted font-normal text-sm ml-2">({machines.length})</span>
            </h2>
            {machines.length === 0 ? (
              <p className="text-muted text-sm">{t.empty}</p>
            ) : (
              <ul className="space-y-2">
                {machines.map((m) => (
                  <li key={m.id}>
                    <Link
                      href={`/q/${m.token}`}
                      className="card px-4 py-3 flex items-center justify-between gap-3 hover:border-[var(--accent)] transition"
                    >
                      <span className="min-w-0">
                        <span className="font-medium block truncate text-navy">
                          {lang === "fr" ? m.nameFr : m.nameEn}
                        </span>
                        <span className="text-muted text-sm truncate block">
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
            className="text-sm text-muted link-accent mb-4"
          >
            ← {t.back}
          </button>
          <h2 className="text-xl font-semibold mb-4 text-navy">{t.scan}</h2>
          <QrScanner />
        </section>
      )}

      {tab === "machines" && mode === "code" && (
        <section>
          <button
            type="button"
            onClick={() => setMode("browse")}
            className="text-sm text-muted link-accent mb-4"
          >
            ← {t.back}
          </button>
          <h2 className="text-xl font-semibold mb-4 text-navy">{t.enterCode}</h2>
          <CodeEntry accent={gym.primaryColor} />
        </section>
      )}

      {tab === "workout" && (
        <WorkoutTracker
          gymSlug={gym.slug}
          primaryColor={gym.primaryColor}
          lang={lang}
          onSaved={() => goTab("progress")}
          machines={machines.map((m) => ({
            id: m.id,
            nameEn: m.nameEn,
            nameFr: m.nameFr,
            category: m.category,
            slug: m.slug,
          }))}
        />
      )}

      {tab === "progress" && (
        <ProgressDashboard
          gymSlug={gym.slug}
          primaryColor={gym.primaryColor}
          lang={lang}
        />
      )}

      <p className="mt-10 text-center text-xs text-muted">
        <Link href="/admin/login" className="hover:text-navy underline-offset-2 hover:underline">
          {t.staff}
        </Link>
      </p>
    </div>
  );
}

function CodeEntry({ accent }: { accent: string }) {
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
      <p className="text-sm text-muted">Paste a QR link, or type the machine token from the sticker.</p>
      <input
        className="input"
        value={manual}
        onChange={(e) => setManual(e.target.value)}
        placeholder="https://…/q/abc123 or token"
        autoFocus
      />
      {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
      <button type="submit" className="btn btn-primary w-full" style={{ background: accent }}>
        Open guide
      </button>
    </form>
  );
}
