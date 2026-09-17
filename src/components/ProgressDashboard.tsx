"use client";

import { useEffect, useMemo, useState } from "react";
import {
  computeMachineProgress,
  formatDuration,
  isCardio,
  loadHistory,
  summarizeStrengthSets,
  type MachineProgress,
  type SavedWorkout,
} from "@/lib/workout";

type Props = {
  gymSlug: string;
  primaryColor: string;
  lang: "en" | "fr";
};

export function ProgressDashboard({ gymSlug, primaryColor, lang }: Props) {
  const [history, setHistory] = useState<SavedWorkout[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const t = useMemo(
    () =>
      lang === "fr"
        ? {
            title: "Progression",
            empty: "Aucun entraînement enregistré. Terminez une séance et appuyez sur Enregistrer.",
            workouts: "séances",
            times: "fois",
            lastUsed: "Dernière fois",
            bestWeight: "Poids max",
            totalSets: "Séries totales",
            lastSession: "Dernière séance",
            lastDuration: "Dernière durée",
            bestDuration: "Meilleure durée",
            totalTime: "Temps total",
            distance: "Distance",
            history: "Historique récent",
            cardio: "Cardio",
            strength: "Force",
            noDetail: "Pas encore de détail.",
          }
        : {
            title: "Progress",
            empty: "No saved workouts yet. Finish a session and tap Save.",
            workouts: "workouts",
            times: "times",
            lastUsed: "Last used",
            bestWeight: "Heaviest",
            totalSets: "Total sets",
            lastSession: "Last session",
            lastDuration: "Last duration",
            bestDuration: "Best duration",
            totalTime: "Total time",
            distance: "Distance",
            history: "Recent history",
            cardio: "Cardio",
            strength: "Strength",
            noDetail: "No detail yet.",
          },
    [lang]
  );

  useEffect(() => {
    setHistory(loadHistory(gymSlug));
    setHydrated(true);
  }, [gymSlug]);

  // Re-read when tab becomes visible again (e.g. after Save)
  useEffect(() => {
    function refresh() {
      setHistory(loadHistory(gymSlug));
    }
    window.addEventListener("focus", refresh);
    window.addEventListener("gymqr-history-updated", refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("gymqr-history-updated", refresh);
    };
  }, [gymSlug]);

  const progress = useMemo(() => computeMachineProgress(history), [history]);

  if (!hydrated) {
    return (
      <div className="card p-6 text-center text-muted text-sm">…</div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-semibold text-navy text-lg">{t.title}</h2>
        {history.length > 0 && (
          <span className="text-xs text-muted">
            {history.length} {t.workouts}
          </span>
        )}
      </div>

      {progress.length === 0 ? (
        <div className="card p-6 text-center space-y-2">
          <p className="text-muted text-sm">{t.empty}</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {progress.map((row) => (
            <li key={row.machineId}>
              <MachineProgressCard
                row={row}
                lang={lang}
                labels={t}
                primaryColor={primaryColor}
                expanded={expanded === row.machineId}
                onToggle={() =>
                  setExpanded((cur) =>
                    cur === row.machineId ? null : row.machineId
                  )
                }
                recentWorkouts={history
                  .filter((w) =>
                    w.exercises.some((e) => e.machineId === row.machineId)
                  )
                  .slice(-5)
                  .reverse()}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function MachineProgressCard({
  row,
  lang,
  labels,
  primaryColor,
  expanded,
  onToggle,
  recentWorkouts,
}: {
  row: MachineProgress;
  lang: "en" | "fr";
  labels: {
    times: string;
    lastUsed: string;
    bestWeight: string;
    totalSets: string;
    lastSession: string;
    lastDuration: string;
    bestDuration: string;
    totalTime: string;
    distance: string;
    history: string;
    cardio: string;
    strength: string;
    noDetail: string;
  };
  primaryColor: string;
  expanded: boolean;
  onToggle: () => void;
  recentWorkouts: SavedWorkout[];
}) {
  const cardio = isCardio(row.category);
  const spark = cardio ? row.durationSpark : row.setCountSpark;
  const lastDate = new Date(row.lastUsedAt);

  return (
    <div className="card overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left px-4 py-3.5 space-y-2 min-h-[52px]"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-medium truncate">
              {lang === "fr" ? row.nameFr : row.nameEn}
            </p>
            <p className="text-muted text-sm">
              {cardio ? labels.cardio : labels.strength} · {row.category}
            </p>
          </div>
          <span className="badge shrink-0">
            {row.timesUsed}× {labels.times}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-muted">
            {labels.lastUsed}:{" "}
            {lastDate.toLocaleDateString(lang === "fr" ? "fr-CA" : "en-CA", {
              month: "short",
              day: "numeric",
            })}
          </p>
          <MiniSpark values={spark} color={primaryColor} />
        </div>

        {cardio ? (
          <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
            <Stat
              label={labels.lastDuration}
              value={formatDuration(row.lastDurationSec)}
            />
            <Stat
              label={labels.bestDuration}
              value={formatDuration(row.bestDurationSec)}
            />
            <Stat
              label={labels.totalTime}
              value={formatDuration(row.totalDurationSec)}
            />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
            <Stat
              label={labels.lastSession}
              value={summarizeStrengthSets(row.lastSets)}
            />
            <Stat
              label={labels.bestWeight}
              value={
                row.heaviestWeightKg !== undefined
                  ? `${row.heaviestWeightKg} kg`
                  : "—"
              }
            />
            <Stat label={labels.totalSets} value={String(row.totalSets)} />
          </div>
        )}
      </button>

      {expanded && (
        <div className="border-t border-border px-4 py-3 bg-[var(--wash)] space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            {labels.history}
          </p>
          {recentWorkouts.length === 0 ? (
            <p className="text-sm text-muted">{labels.noDetail}</p>
          ) : (
            <ul className="space-y-1.5">
              {recentWorkouts.map((w) => {
                const ex = w.exercises.find((e) => e.machineId === row.machineId);
                if (!ex) return null;
                const when = new Date(w.savedAt).toLocaleString(
                  lang === "fr" ? "fr-CA" : "en-CA",
                  { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }
                );
                let detail: string;
                if (cardio && ex.cardio) {
                  detail = formatDuration(
                    ex.cardio.minutes * 60 + ex.cardio.seconds
                  );
                  if (ex.cardio.distanceKm !== undefined) {
                    detail += ` · ${ex.cardio.distanceKm} km`;
                  }
                } else {
                  detail = summarizeStrengthSets(ex.sets);
                }
                return (
                  <li
                    key={w.id}
                    className="flex items-center justify-between gap-2 text-sm rounded-lg bg-[var(--wash)] px-3 py-2"
                  >
                    <span className="text-muted shrink-0">{when}</span>
                    <span className="font-medium text-right truncate">{detail}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-[var(--wash)] px-2 py-2 min-w-0">
      <p className="text-muted truncate mb-0.5">{label}</p>
      <p className="font-semibold text-navy truncate text-sm">{value}</p>
    </div>
  );
}

function MiniSpark({ values, color }: { values: number[]; color: string }) {
  if (values.length < 2) {
    return <span className="text-muted text-xs">·</span>;
  }
  const max = Math.max(...values, 1);
  const w = 56;
  const h = 18;
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - (v / max) * (h - 2) - 1;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg width={w} height={h} className="shrink-0 opacity-80" aria-hidden>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={pts}
      />
    </svg>
  );
}
