/** In-progress workout persisted in localStorage (no member login). */

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
  sets: StrengthSet[];
  cardio: CardioLog | null;
};

export type WorkoutSession = {
  gymSlug: string;
  startedAt: string;
  exercises: WorkoutExercise[];
};

export function isCardio(category: string): boolean {
  return category === "Cardio";
}

export function storageKey(gymSlug: string): string {
  return `gymqr-workout:${gymSlug}`;
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
};

/** Add machine to session (or return existing entry). Persists. */
export function addMachineToWorkout(
  gymSlug: string,
  machine: MachineRef
): WorkoutSession {
  const session = loadWorkout(gymSlug) ?? emptyWorkout(gymSlug);
  const existing = session.exercises.find((e) => e.machineId === machine.id);
  if (existing) {
    saveWorkout(session);
    return session;
  }
  const cardio = isCardio(machine.category);
  const exercise: WorkoutExercise = {
    id: newId(),
    machineId: machine.id,
    nameEn: machine.nameEn,
    nameFr: machine.nameFr,
    category: machine.category,
    sets: cardio ? [] : [],
    cardio: cardio ? { minutes: 0, seconds: 0 } : null,
  };
  session.exercises.push(exercise);
  saveWorkout(session);
  return session;
}
