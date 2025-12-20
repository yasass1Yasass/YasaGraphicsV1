import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  handler: async (ctx) => {
    const designs = await ctx.db
      .query("designs")
      .withIndex("by_created_at")
      .order("desc")
      .collect();

    return designs.map((design) => ({
      id: design._id,
      title: design.title,
      subtitle: design.description || "",
      category: design.category,
      price: design.price_lkr,
      image: design.image || "",
      video: design.video || undefined,
      starting: design.badge === "starting",
      discountEnabled: design.discount_enabled || false,
      discountPercentage: design.discount_percentage || 0,
      createdAt: design.created_at,
    }));
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    subtitle: v.string(),
    category: v.string(),
    price: v.number(),
    image: v.optional(v.string()),
    video: v.optional(v.string()),
    starting: v.optional(v.boolean()),
    discountEnabled: v.optional(v.boolean()),
    discountPercentage: v.optional(v.number()),
    token: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify admin token (simple check)
    if (!args.token || args.token.length < 10) {
      throw new Error("Unauthorized");
    }

    if (!args.title || !args.subtitle || !args.category || !args.price) {
      throw new Error("Missing required fields");
    }

    if (!args.image && !args.video) {
      throw new Error("At least image or video is required");
    }

    const now = Date.now();
    const designId = await ctx.db.insert("designs", {
      title: args.title,
      description: args.subtitle,
      category: args.category,
      price_lkr: args.price,
      image: args.image || undefined,
      video: args.video || undefined,
      badge: args.starting ? "starting" : undefined,
      discount_enabled: args.discountEnabled || false,
      discount_percentage: args.discountEnabled && args.discountPercentage
        ? Math.min(100, Math.max(0, args.discountPercentage))
        : 0,
      created_at: now,
      updated_at: now,
    });

    return {
      id: designId,
      title: args.title,
      subtitle: args.subtitle,
      category: args.category,
      price: args.price,
      image: args.image || "",
      video: args.video,
      starting: args.starting || false,
      discountEnabled: args.discountEnabled || false,
      discountPercentage: args.discountPercentage || 0,
      createdAt: now,
    };
  },
});

export const update = mutation({
  args: {
    id: v.id("designs"),
    title: v.string(),
    subtitle: v.string(),
    category: v.string(),
    price: v.number(),
    image: v.optional(v.string()),
    video: v.optional(v.string()),
    starting: v.optional(v.boolean()),
    discountEnabled: v.optional(v.boolean()),
    discountPercentage: v.optional(v.number()),
    token: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify admin token (simple check)
    if (!args.token || args.token.length < 10) {
      throw new Error("Unauthorized");
    }

    if (!args.title || !args.subtitle || !args.category || !args.price) {
      throw new Error("Missing required fields");
    }

    if (!args.image && !args.video) {
      throw new Error("At least image or video is required");
    }

    await ctx.db.patch(args.id, {
      title: args.title,
      description: args.subtitle,
      category: args.category,
      price_lkr: args.price,
      image: args.image || undefined,
      video: args.video || undefined,
      badge: args.starting ? "starting" : undefined,
      discount_enabled: args.discountEnabled || false,
      discount_percentage: args.discountEnabled && args.discountPercentage
        ? Math.min(100, Math.max(0, args.discountPercentage))
        : 0,
      updated_at: Date.now(),
    });

    const design = await ctx.db.get(args.id);
    if (!design) {
      throw new Error("Design not found");
    }

    return {
      id: design._id,
      title: design.title,
      subtitle: design.description || "",
      category: design.category,
      price: design.price_lkr,
      image: design.image || "",
      video: design.video,
      starting: design.badge === "starting",
      discountEnabled: design.discount_enabled || false,
      discountPercentage: design.discount_percentage || 0,
    };
  },
});

export const remove = mutation({
  args: {
    id: v.id("designs"),
    token: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify admin token (simple check)
    if (!args.token || args.token.length < 10) {
      throw new Error("Unauthorized");
    }

    // Check if document exists before deleting
    const design = await ctx.db.get(args.id);
    if (!design) {
      throw new Error("Design not found");
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});

