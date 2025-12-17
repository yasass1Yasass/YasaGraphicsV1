import { QueryCtx } from "./_generated/server";

// Helper to get file URL from storage ID
export async function getStorageUrl(
  ctx: QueryCtx,
  storageId: string | undefined | null
): Promise<string | undefined> {
  if (!storageId) return undefined;
  try {
    const url = await ctx.storage.getUrl(storageId as any);
    return url ?? undefined;
  } catch {
    return undefined;
  }
}

