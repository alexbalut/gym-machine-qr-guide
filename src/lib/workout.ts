/** In-progress + saved workout history in localStorage (no member login). */

export type StrengthSet = {
  id: string;
  reps: number;
  weightKg?: number;
};

export type CardioLog = {
  minutes: number;
  seconds: number;
  distanceKm?: number;
};

export type WorkoutExercise = {
  id: string;
  machineId: string;
  nameEn: string;
  nameFr: string;
  category: string;
  slug?: string;
  sets: StrengthSet[];
  cardio: CardioLog | null;
};

export type WorkoutSession = {
  gymSlug: string;
  startedAt: string;
  exercises: WorkoutExercise[];
};

/** Completed workout snapshot stored in history. */
export type SavedWorkout = {
  id: string;
  gymSlug: string;
  startedAt: string;
  savedAt: string;
  exercises: WorkoutExercise[];
};

export type MachineProgress = {
  machineId: string;
  nameEn: string;
  nameFr: string;
  category: string;
  slug?: string;
  timesUsed: number;
  lastUsedAt: string;
  /** Strength */
  totalSets: number;
  heaviestWeightKg?: number;
  lastSets: StrengthSet[];
  /** Recent set-count per session (oldest → newest), for sparkline */
  setCountSpark: number[];
  /** Cardio */
  lastDurationSec: number;
  bestDurationSec: number;
  totalDurationSec: number;
  lastDistanceKm?: number;
  /** Recent durations in seconds (oldest → newest) */
  durationSpark: number[];
};

export function isCardio(category: string): boolean {
  return category === "Cardio";
}

export function storageKey(gymSlug: string): string {
  return `gymqr-workout:${gymSlug}`;
}

export function historyKey(gymSlug: string): string {
  return `gymqr-history:${gymSlug}`;
}

export function loadWorkout(gymSlug: string): WorkoutSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(storageKey(gymSlug));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as WorkoutSession;
    if (!parsed || parsed.gymSlug !== gymSlug || !Array.isArray(parsed.exercises)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveWorkout(session: WorkoutSession): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(session.gymSlug), JSON.stringify(session));
}

export function clearWorkout(gymSlug: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(storageKey(gymSlug));
}

export function emptyWorkout(gymSlug: string): WorkoutSession {
  return {
    gymSlug,
    startedAt: new Date().toISOString(),
    exercises: [],
  };
}

export function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export type MachineRef = {
  id: string;
  nameEn: string;
  nameFr: string;
  category: string;
  slug?: string;
};

/** Add machine to session (or return existing entry). Persists. */
export function addMachineToWorkout(
  gymSlug: string,
  machine: MachineRef
): WorkoutSession {
  const session = loadWorkout(gymSlug) ?? emptyWorkout(gymSlug);
  const existing = session.exercises.find((e) => e.machineId === machine.id);
  if (existing) {
    if (!existing.slug && machine.slug) {
      existing.slug = machine.slug;
      saveWorkout(session);
    }
    return session;
  }
  const cardio = isCardio(machine.category);
  const exercise: WorkoutExercise = {
    id: newId(),
    machineId: machine.id,
    nameEn: machine.nameEn,
    nameFr: machine.nameFr,
    category: machine.category,
    ...(machine.slug ? { slug: machine.slug } : {}),
    sets: [],
    cardio: cardio ? { minutes: 0, seconds: 0 } : null,
  };
  session.exercises.push(exercise);
  saveWorkout(session);
  return session;
}

export function loadHistory(gymSlug: string): SavedWorkout[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(historyKey(gymSlug));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedWorkout[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (w) => w && w.gymSlug === gymSlug && Array.isArray(w.exercises)
    );
  } catch {
    return [];
  }
}

function persistHistory(gymSlug: string, history: SavedWorkout[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(historyKey(gymSlug), JSON.stringify(history));
}

/**
 * Snapshot the in-progress session into saved history.
 * Returns null if there is nothing useful to save.
 */
export function commitWorkoutToHistory(session: WorkoutSession): SavedWorkout | null {
  if (!session.exercises.length) return null;

  const exercises = session.exercises
    .map((ex) => ({
      ...ex,
      sets: [...ex.sets],
      cardio: ex.cardio ? { ...ex.cardio } : null,
    }))
    .filter((ex) => {
      if (isCardio(ex.category)) {
        const c = ex.cardio;
        return !!c && (c.minutes > 0 || c.seconds > 0 || (c.distanceKm ?? 0) > 0);
      }
      return ex.sets.length > 0;
    });

  if (exercises.length === 0) return null;

  const saved: SavedWorkout = {
    id: newId(),
    gymSlug: session.gymSlug,
    startedAt: session.startedAt,
    savedAt: new Date().toISOString(),
    exercises,
  };

  const history = loadHistory(session.gymSlug);
  history.push(saved);
  persistHistory(session.gymSlug, history);
  return saved;
}

export function cardioDurationSeconds(c: CardioLog | null | undefined): number {
  if (!c) return 0;
  return Math.max(0, c.minutes) * 60 + Math.max(0, Math.min(59, c.seconds));
}

export function formatDuration(totalSec: number): string {
  const s = Math.max(0, Math.round(totalSec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  if (m >= 60) {
    const h = Math.floor(m / 60);
    const mm = m % 60;
    return `${h}h ${String(mm).padStart(2, "0")}m`;
  }
  return `${m}:${String(r).padStart(2, "0")}`;
}

/** Aggregate saved history into per-machine progress rows. */
export function computeMachineProgress(history: SavedWorkout[]): MachineProgress[] {
  type Acc = {
    machineId: string;
    nameEn: string;
    nameFr: string;
    category: string;
    slug?: string;
    timesUsed: number;
    lastUsedAt: string;
    totalSets: number;
    heaviestWeightKg?: number;
    lastSets: StrengthSet[];
    setCountSpark: number[];
    lastDurationSec: number;
    bestDurationSec: number;
    totalDurationSec: number;
    lastDistanceKm?: number;
    durationSpark: number[];
  };

  const map = new Map<string, Acc>();

  const sorted = [...history].sort(
    (a, b) => new Date(a.savedAt).getTime() - new Date(b.savedAt).getTime()
  );

  for (const workout of sorted) {
    const seenInWorkout = new Set<string>();
    for (const ex of workout.exercises) {
      let acc = map.get(ex.machineId);
      if (!acc) {
        acc = {
          machineId: ex.machineId,
          nameEn: ex.nameEn,
          nameFr: ex.nameFr,
          category: ex.category,
          slug: ex.slug,
          timesUsed: 0,
          lastUsedAt: workout.savedAt,
          totalSets: 0,
          lastSets: [],
          setCountSpark: [],
          lastDurationSec: 0,
          bestDurationSec: 0,
          totalDurationSec: 0,
          durationSpark: [],
        };
        map.set(ex.machineId, acc);
      } else {
        acc.nameEn = ex.nameEn;
        acc.nameFr = ex.nameFr;
        acc.category = ex.category;
        if (ex.slug) acc.slug = ex.slug;
      }

      if (!seenInWorkout.has(ex.machineId)) {
        acc.timesUsed += 1;
        seenInWorkout.add(ex.machineId);
      }
      acc.lastUsedAt = workout.savedAt;

      if (isCardio(ex.category)) {
        const dur = cardioDurationSeconds(ex.cardio);
        acc.lastDurationSec = dur;
        acc.bestDurationSec = Math.max(acc.bestDurationSec, dur);
        acc.totalDurationSec += dur;
        if (ex.cardio?.distanceKm !== undefined) {
          acc.lastDistanceKm = ex.cardio.distanceKm;
        }
        acc.durationSpark.push(dur);
        if (acc.durationSpark.length > 12) acc.durationSpark.shift();
      } else {
        acc.totalSets += ex.sets.length;
        acc.lastSets = ex.sets.map((s) => ({ ...s }));
        for (const s of ex.sets) {
          if (s.weightKg !== undefined) {
            acc.heaviestWeightKg =
              acc.heaviestWeightKg === undefined
                ? s.weightKg
                : Math.max(acc.heaviestWeightKg, s.weightKg);
          }
        }
        acc.setCountSpark.push(ex.sets.length);
        if (acc.setCountSpark.length > 12) acc.setCountSpark.shift();
      }
    }
  }

  return [...map.values()].sort(
    (a, b) => new Date(b.lastUsedAt).getTime() - new Date(a.lastUsedAt).getTime()
  );
}

/** Summarize last strength session e.g. "3×10 · 60 kg" */
export function summarizeStrengthSets(sets: StrengthSet[]): string {
  if (!sets.length) return "—";
  const reps = sets.map((s) => s.reps);
  const sameReps = reps.every((r) => r === reps[0]);
  const weights = sets
    .map((s) => s.weightKg)
    .filter((w): w is number => w !== undefined);
  const maxW = weights.length ? Math.max(...weights) : undefined;

  let core: string;
  if (sameReps) {
    core = `${sets.length}×${reps[0]}`;
  } else {
    core = sets.map((s) => `${s.reps}`).join("+") + " reps";
  }
  if (maxW !== undefined) core += ` · ${maxW} kg`;
  return core;
}
