import type { D1Database } from "@cloudflare/workers-types";

export type TrackScanDb = D1Database;

export function jsonFallbackEnabled(): boolean {
  return (
    process.env.TRACK_SCAN_USE_JSON === "1" ||
    process.env.TRACK_SCAN_DATA_SOURCE === "json"
  );
}

export async function getDb(): Promise<TrackScanDb | null> {
  if (jsonFallbackEnabled()) return null;

  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const { env } = await getCloudflareContext({ async: true });
    const db = (env as { DB?: TrackScanDb }).DB;
    if (db) return db;
  } catch {
    /* not running on Cloudflare / OpenNext */
  }

  if (typeof globalThis.DB !== "undefined") {
    return globalThis.DB;
  }

  return null;
}

export async function dbConfigured(): Promise<boolean> {
  return (await getDb()) !== null;
}
