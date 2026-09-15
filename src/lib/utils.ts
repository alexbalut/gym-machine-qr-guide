export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function parseJsonArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export function appUrl(path = "") {
  const base = (process.env.APP_URL || "http://localhost:3000").replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function machineQrUrl(token: string) {
  return appUrl(`/q/${token}`);
}

export type Lang = "en" | "fr";

export function pickLang<T>(en: T, fr: T, lang: Lang): T {
  return lang === "fr" ? fr : en;
}
