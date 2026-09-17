"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  addMachineToWorkout,
  clearWorkout,
  commitWorkoutToHistory,
  emptyWorkout,
  isCardio,
  loadWorkout,
  newId,
  saveWorkout,
  type MachineRef,
  type WorkoutExercise,
  type WorkoutSession,
} from "@/lib/workout";

type Props = {
  gymSlug: string;
  primaryColor: string;
  machines: MachineRef[];
  lang: "en" | "fr";
  onSaved?: () => void;
};

export function WorkoutTracker({ gymSlug, primaryColor, machines, lang, onSaved }: Props) {
  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const t = useMemo(
    () =>
      lang === "fr"
        ? {
            title: "Séance en cours",
            empty: "Aucune séance. Ajoutez une machine pour commencer.",
            add: "Ajouter une machine",
            pick: "Choisir une machine",
            cancel: "Annuler",
            reps: "Répétitions",
            weight: "Poids (kg)",
            addSet: "Ajouter une série",
            removeSet: "Retirer",
            removeEx: "Retirer l'exercice",
            minutes: "Minutes",
            seconds: "Secondes",
            distance: "Distance (km)",
            saveCardio: "Enregistrer",
            finish: "Terminer",
            clear: "Effacer",
            save: "Enregistrer",
            finished: "Séance terminée — bonne récupération!",
            cleared: "Séance effacée.",
            saved: "Séance enregistrée!",
            nothingToSave: "Rien à enregistrer — ajoutez des séries ou une durée.",
            added: "Ajouté à la séance.",
            already: "Déjà dans la séance.",
            sets: "Séries",
            cardio: "Cardio",
            noMachines: "Aucune machine active.",
            optional: "optionnel",
          }
        : {
            title: "Current workout",
            empty: "No workout yet. Add a machine to start logging.",
            add: "Add a machine",
            pick: "Pick a machine",
            cancel: "Cancel",
            reps: "Reps",
            weight: "Weight (kg)",
            addSet: "Add set",
            removeSet: "Remove",
            removeEx: "Remove exercise",
            minutes: "Minutes",
            seconds: "Seconds",
            distance: "Distance (km)",
            saveCardio: "Save",
            finish: "Finish",
            clear: "Clear",
            save: "Save",
            finished: "Workout finished — nice work!",
            cleared: "Workout cleared.",
            saved: "Workout saved!",
            nothingToSave: "Nothing to save — log sets or a duration first.",
            added: "Added to workout.",
            already: "Already in workout.",
            sets: "Sets",
            cardio: "Cardio",
            noMachines: "No active machines.",
            optional: "optional",
          },
    [lang]
  );

  useEffect(() => {
    setSession(loadWorkout(gymSlug) ?? emptyWorkout(gymSlug));
    setHydrated(true);
  }, [gymSlug]);

  const persist = useCallback(
    (next: WorkoutSession) => {
      setSession(next);
      saveWorkout(next);
    },
    []
  );

  function showToast(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  }

  function handleAddMachine(machine: MachineRef) {
    const before = loadWorkout(gymSlug);
    const had = before?.exercises.some((e) => e.machineId === machine.id);
    const next = addMachineToWorkout(gymSlug, machine);
    setSession(next);
    setPickerOpen(false);
    showToast(had ? t.already : t.added);
  }

  function updateExercise(exId: string, updater: (ex: WorkoutExercise) => WorkoutExercise) {
    if (!session) return;
    const next: WorkoutSession = {
      ...session,
      exercises: session.exercises.map((e) => (e.id === exId ? updater(e) : e)),
    };
    persist(next);
  }

  function removeExercise(exId: string) {
    if (!session) return;
    persist({
      ...session,
      exercises: session.exercises.filter((e) => e.id !== exId),
    });
  }

  function addSet(exId: string, reps: number, weightKg?: number) {
    updateExercise(exId, (ex) => ({
      ...ex,
      sets: [
        ...ex.sets,
        {
          id: newId(),
          reps,
          ...(weightKg !== undefined && !Number.isNaN(weightKg) ? { weightKg } : {}),
        },
      ],
    }));
  }

  function removeSet(exId: string, setId: string) {
    updateExercise(exId, (ex) => ({
      ...ex,
      sets: ex.sets.filter((s) => s.id !== setId),
    }));
  }

  function setCardio(
    exId: string,
    minutes: number,
    seconds: number,
    distanceKm?: number
  ) {
    updateExercise(exId, (ex) => ({
      ...ex,
      cardio: {
        minutes: Math.max(0, minutes),
        seconds: Math.min(59, Math.max(0, seconds)),
        ...(distanceKm !== undefined && !Number.isNaN(distanceKm)
          ? { distanceKm }
          : {}),
      },
    }));
  }

  function finishWorkout() {
    clearWorkout(gymSlug);
    setSession(emptyWorkout(gymSlug));
    showToast(t.finished);
  }

  function clearSession() {
    clearWorkout(gymSlug);
    setSession(emptyWorkout(gymSlug));
    showToast(t.cleared);
  }

  function saveSession() {
    if (!session) return;
    const saved = commitWorkoutToHistory(session);
    if (!saved) {
      showToast(t.nothingToSave);
      return;
    }
    clearWorkout(gymSlug);
    setSession(emptyWorkout(gymSlug));
    showToast(t.saved);
    window.dispatchEvent(new Event("gymqr-history-updated"));
    window.setTimeout(() => onSaved?.(), 600);
  }

  if (!hydrated || !session) {
    return (
      <div className="card p-6 text-center text-muted text-sm">
        …
      </div>
    );
  }

  const inWorkoutIds = new Set(session.exercises.map((e) => e.machineId));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-semibold text-navy text-lg">{t.title}</h2>
        {session.exercises.length > 0 && (
          <span className="text-xs text-muted">
            {session.exercises.length} · {new Date(session.startedAt).toLocaleTimeString()}
          </span>
        )}
      </div>

      {toast && (
        <p
          className="text-sm rounded-xl px-3 py-2 border border-[#c7e4cf] bg-[#eef8f1] text-[var(--ok)]"
          role="status"
        >
          {toast}
        </p>
      )}

      {session.exercises.length === 0 ? (
        <p className="text-muted text-sm">{t.empty}</p>
      ) : (
        <ul className="space-y-4">
          {session.exercises.map((ex) => (
            <li key={ex.id} className="card p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium truncate">
                    {lang === "fr" ? ex.nameFr : ex.nameEn}
                  </p>
                  <p className="text-muted text-sm">
                    {isCardio(ex.category) ? t.cardio : t.sets} · {ex.category}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeExercise(ex.id)}
                  className="text-xs text-[var(--danger)] hover:opacity-80 shrink-0 px-2 py-1"
                >
                  {t.removeEx}
                </button>
              </div>

              {isCardio(ex.category) ? (
                <CardioForm
                  lang={lang}
                  labels={{
                    minutes: t.minutes,
                    seconds: t.seconds,
                    distance: t.distance,
                    save: t.saveCardio,
                    optional: t.optional,
                  }}
                  value={ex.cardio ?? { minutes: 0, seconds: 0 }}
                  onSave={(minutes, seconds, distanceKm) =>
                    setCardio(ex.id, minutes, seconds, distanceKm)
                  }
                  primaryColor={primaryColor}
                />
              ) : (
                <StrengthForm
                  lang={lang}
                  labels={{
                    reps: t.reps,
                    weight: t.weight,
                    addSet: t.addSet,
                    removeSet: t.removeSet,
                    optional: t.optional,
                  }}
                  sets={ex.sets}
                  onAdd={(reps, weightKg) => addSet(ex.id, reps, weightKg)}
                  onRemove={(setId) => removeSet(ex.id, setId)}
                  primaryColor={primaryColor}
                />
              )}
            </li>
          ))}
        </ul>
      )}

      {!pickerOpen ? (
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="btn btn-primary w-full !py-3.5 text-base"
          style={{ background: primaryColor }}
        >
          {t.add}
        </button>
      ) : (
        <div className="card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-navy">{t.pick}</h3>
            <button
              type="button"
              onClick={() => setPickerOpen(false)}
              className="text-sm text-muted link-accent"
            >
              {t.cancel}
            </button>
          </div>
          {machines.length === 0 ? (
            <p className="text-muted text-sm">{t.noMachines}</p>
          ) : (
            <ul className="space-y-2 max-h-72 overflow-y-auto">
              {machines.map((m) => {
                const inList = inWorkoutIds.has(m.id);
                return (
                  <li key={m.id}>
                    <button
                      type="button"
                      onClick={() => handleAddMachine(m)}
                      className="w-full text-left card px-4 py-3.5 flex items-center justify-between gap-3 hover:border-[var(--accent)] transition min-h-[52px]"
                    >
                      <span className="min-w-0">
                        <span className="font-medium block truncate">
                          {lang === "fr" ? m.nameFr : m.nameEn}
                        </span>
                        <span className="text-muted text-sm">{m.category}</span>
                      </span>
                      <span className="badge shrink-0">{inList ? "✓" : "+"}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {session.exercises.length > 0 && (
        <div className="space-y-3 pt-1">
          <button
            type="button"
            onClick={saveSession}
            className="btn btn-primary w-full !py-3.5 text-base"
            style={{ background: primaryColor }}
          >
            {t.save}
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={clearSession} className="btn btn-danger !py-3">
              {t.clear}
            </button>
            <button
              type="button"
              onClick={finishWorkout}
              className="btn btn-secondary !py-3"
              style={{ borderColor: `${primaryColor}66` }}
            >
              {t.finish}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StrengthForm({
  labels,
  sets,
  onAdd,
  onRemove,
  primaryColor,
}: {
  lang: "en" | "fr";
  labels: {
    reps: string;
    weight: string;
    addSet: string;
    removeSet: string;
    optional: string;
  };
  sets: { id: string; reps: number; weightKg?: number }[];
  onAdd: (reps: number, weightKg?: number) => void;
  onRemove: (setId: string) => void;
  primaryColor: string;
}) {
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const r = parseInt(reps, 10);
    if (!r || r < 1) return;
    const w = weight.trim() === "" ? undefined : parseFloat(weight);
    onAdd(r, w);
    setReps("");
    // keep weight for next set convenience
  }

  return (
    <div className="space-y-3">
      {sets.length > 0 && (
        <ul className="space-y-1.5">
          {sets.map((s, i) => (
            <li
              key={s.id}
              className="flex items-center justify-between gap-2 rounded-lg bg-[var(--wash)] px-3 py-2 text-sm"
            >
              <span>
                <span className="text-muted mr-2">#{i + 1}</span>
                <span className="font-semibold">{s.reps}</span> reps
                {s.weightKg !== undefined && (
                  <span className="text-muted"> · {s.weightKg} kg</span>
                )}
              </span>
              <button
                type="button"
                onClick={() => onRemove(s.id)}
                className="text-xs text-muted hover:text-[var(--danger)] px-2 py-1 min-h-[36px]"
              >
                {labels.removeSet}
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={submit} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-end">
        <div>
          <label className="label">{labels.reps}</label>
          <input
            className="input !py-3 text-lg text-center"
            inputMode="numeric"
            pattern="[0-9]*"
            value={reps}
            onChange={(e) => setReps(e.target.value.replace(/\D/g, ""))}
            placeholder="10"
            required
          />
        </div>
        <div>
          <label className="label">
            {labels.weight}{" "}
            <span className="text-muted font-normal">({labels.optional})</span>
          </label>
          <input
            className="input !py-3 text-lg text-center"
            inputMode="decimal"
            value={weight}
            onChange={(e) => setWeight(e.target.value.replace(/[^0-9.]/g, ""))}
            placeholder="60"
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary !px-4 !py-3 min-h-[48px] self-end"
          style={{ background: primaryColor }}
        >
          +
        </button>
      </form>
      <p className="text-xs text-muted sr-only">{labels.addSet}</p>
    </div>
  );
}

function CardioForm({
  labels,
  value,
  onSave,
  primaryColor,
}: {
  lang: "en" | "fr";
  labels: {
    minutes: string;
    seconds: string;
    distance: string;
    save: string;
    optional: string;
  };
  value: { minutes: number; seconds: number; distanceKm?: number };
  onSave: (minutes: number, seconds: number, distanceKm?: number) => void;
  primaryColor: string;
}) {
  const [minutes, setMinutes] = useState(String(value.minutes || ""));
  const [seconds, setSeconds] = useState(String(value.seconds || ""));
  const [distance, setDistance] = useState(
    value.distanceKm !== undefined ? String(value.distanceKm) : ""
  );

  useEffect(() => {
    setMinutes(String(value.minutes || ""));
    setSeconds(String(value.seconds || ""));
    setDistance(value.distanceKm !== undefined ? String(value.distanceKm) : "");
  }, [value.minutes, value.seconds, value.distanceKm]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const m = parseInt(minutes || "0", 10);
    const s = parseInt(seconds || "0", 10);
    const d = distance.trim() === "" ? undefined : parseFloat(distance);
    onSave(m, s, d);
  }

  const hasLogged = value.minutes > 0 || value.seconds > 0;

  return (
    <div className="space-y-3">
      {hasLogged && (
        <p className="text-sm rounded-lg bg-[var(--wash)] px-3 py-2">
          <span className="font-semibold">
            {value.minutes}:{String(value.seconds).padStart(2, "0")}
          </span>
          {value.distanceKm !== undefined && (
            <span className="text-muted"> · {value.distanceKm} km</span>
          )}
        </p>
      )}
      <form onSubmit={submit} className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="label">{labels.minutes}</label>
            <input
              className="input !py-3 text-lg text-center"
              inputMode="numeric"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value.replace(/\D/g, ""))}
              placeholder="20"
            />
          </div>
          <div>
            <label className="label">{labels.seconds}</label>
            <input
              className="input !py-3 text-lg text-center"
              inputMode="numeric"
              value={seconds}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "");
                const n = parseInt(v || "0", 10);
                setSeconds(String(Math.min(59, n)));
              }}
              placeholder="00"
            />
          </div>
        </div>
        <div>
          <label className="label">
            {labels.distance}{" "}
            <span className="text-muted font-normal">({labels.optional})</span>
          </label>
          <input
            className="input !py-3 text-lg text-center"
            inputMode="decimal"
            value={distance}
            onChange={(e) => setDistance(e.target.value.replace(/[^0-9.]/g, ""))}
            placeholder="3.5"
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary w-full !py-3"
          style={{ background: primaryColor }}
        >
          {labels.save}
        </button>
      </form>
    </div>
  );
}
