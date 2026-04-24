export type Lang = "zh" | "en";

export function localize<T extends string | Record<Lang, string>>(value: T, lang: Lang): string {
  if (value && typeof value === "object") {
    return value[lang] || value.zh || value.en;
  }
  return String(value);
}
