import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getStorageUrl } from "./utils";

export const list = query({
  handler: async (ctx) => {
    const items = await ctx.db
      .query("profiling")
      .withIndex("by_created_at")
      .order("desc")
      .collect();

    return Promise.all(items.map(async (item) => ({
      id: item._id,
      category: item.category,
      title: item.title,
      description: item.description || "",
      image_url: item.image_url ? (await getStorageUrl(ctx, item.image_url)) || item.image_url : "",
      video_url: item.video_url ? (await getStorageUrl(ctx, item.video_url)) || item.video_url : "",
      url: item.url || "",
      createdAt: item.created_at,
    })));
  },
});

export const create = mutation({
  args: {
    category: v.string(),
    title: v.string(),
    description: v.string(),
    image_url: v.optional(v.string()),
    video_url: v.optional(v.string()),
    url: v.optional(v.string()),
    token: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify admin token (simple check)
    if (!args.token || args.token.length < 10) {
      throw new Error("Unauthorized");
    }

    if (!args.category || !args.title || !args.description) {
      throw new Error("Missing required fields: category, title, description");
    }

    // Allow at least one of: image, video, or url
    if (!args.image_url && !args.video_url && !args.url) {
      throw new Error("At least one of image, video, or URL is required");
    }

    const now = Date.now();
    const itemId = await ctx.db.insert("profiling", {
      category: args.category,
      title: args.title,
      description: args.description,
      image_url: args.image_url || undefined,
      video_url: args.video_url || undefined,
      url: args.url || undefined,
      created_at: now,
      updated_at: now,
    });

    return {
      id: itemId,
      category: args.category,
      title: args.title,
      description: args.description,
      image_url: args.image_url || "",
      video_url: args.video_url || "",
      url: args.url || "",
      createdAt: now,
    };
  },
});

export const remove = mutation({
  args: {
    id: v.id("profiling"),
    token: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify admin token (simple check)
    if (!args.token || args.token.length < 10) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});

