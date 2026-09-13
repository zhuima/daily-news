interface CloudflareEnv {
  DB: D1Database;
  ASSETS: Fetcher;
  NEXT_PUBLIC_SITE_URL?: string;
  ACCOUNTS_ADMIN_TOKEN?: string;
}

declare global {
  var DB: D1Database | undefined;
}

export type { CloudflareEnv };
