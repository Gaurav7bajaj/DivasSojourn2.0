/**
 * Phase 1 JSON store helpers.
 *
 * Phase 2 will replace the contents of lib/data/*.ts with real database calls
 * (Postgres + Prisma). No other files should need to change.
 */

import { promises as fs } from "fs";
import path from "path";

const STORE_DIR = path.join(process.cwd(), "data", "store");

async function ensureStoreDir() {
  await fs.mkdir(STORE_DIR, { recursive: true });
}

export async function readJsonFile<T>(filename: string, fallback: T): Promise<T> {
  await ensureStoreDir();
  const filePath = path.join(STORE_DIR, filename);

  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === "ENOENT") {
      await writeJsonFile(filename, fallback);
      return fallback;
    }
    throw error;
  }
}

export async function writeJsonFile<T>(filename: string, data: T): Promise<void> {
  await ensureStoreDir();
  const filePath = path.join(STORE_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}
