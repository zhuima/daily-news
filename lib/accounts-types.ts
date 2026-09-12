export type TrackedAccount = {
  slug: string;
  name: string;
  notes?: string;
  addedAt: string;
};

export type AccountsDocument = {
  version: string;
  updatedAt: string;
  accounts: TrackedAccount[];
};
