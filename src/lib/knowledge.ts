import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";

export type PrincipleKnowledge = {
  id: string;
  title: string;
  status: string;
  description: string;
};

function frontmatterValue(source: string, key: string): string {
  const line = source.split("\n").find((candidate) => candidate.startsWith(`${key}:`));
  return line?.slice(key.length + 1).trim().replace(/^['"]|['"]$/g, "") ?? "";
}

export async function loadPrinciples(): Promise<PrincipleKnowledge[]> {
  const directory = path.join(process.cwd(), ".okf", "principles");
  const files = (await fs.readdir(directory)).filter((file) => file.endsWith(".md")).sort();
  const records = await Promise.all(files.map(async (file) => {
    const source = await fs.readFile(path.join(directory, file), "utf8");
    const body = source.split("---").slice(2).join("---").trim();
    const description = body.split("\n").filter((line) => line.trim() && !line.startsWith("#"))[0]?.trim() ?? "";
    return { id: frontmatterValue(source, "id"), title: frontmatterValue(source, "title"), status: frontmatterValue(source, "status"), description };
  }));
  return records.sort((left, right) => left.id.localeCompare(right.id));
}
