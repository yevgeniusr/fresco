export type CitizenId = string & { readonly __brand: "CitizenId" };
export type GoalId = string & { readonly __brand: "GoalId" };
export type IdeaId = string & { readonly __brand: "IdeaId" };
export type ExperimentId = string & { readonly __brand: "ExperimentId" };

export function newId(prefix: "cit" | "goal" | "idea" | "exp" | "res" | "dec" | "com" | "ses"): string {
  return `${prefix}_${crypto.randomUUID()}`;
}

export function slugify(value: string): string {
  const normalized = value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);
  return normalized || crypto.randomUUID();
}
