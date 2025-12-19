import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get all site settings
export const get = query({
  handler: async (ctx) => {
    const settings = await ctx.db
      .query("siteSettings")
      .withIndex("by_key", (q) => q.eq("key", "main"))
      .first();
    return settings || null;
  },
});

// Update hero section
export const updateHeroSection = mutation({
  args: {
    title: v.string(),
    subtitle: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("siteSettings")
      .withIndex("by_key", (q) => q.eq("key", "main"))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        heroTitle: args.title,
        heroSubtitle: args.subtitle,
        heroDescription: args.description,
        updated_at: Date.now(),
      });
    } else {
      await ctx.db.insert("siteSettings", {
        key: "main",
        heroTitle: args.title,
        heroSubtitle: args.subtitle,
        heroDescription: args.description,
        updated_at: Date.now(),
      });
    }
  },
});

// Update portfolio heading
export const updatePortfolioHeading = mutation({
  args: {
    heading: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("siteSettings")
      .withIndex("by_key", (q) => q.eq("key", "main"))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        portfolioHeading: args.heading,
        updated_at: Date.now(),
      });
    } else {
      await ctx.db.insert("siteSettings", {
        key: "main",
        portfolioHeading: args.heading,
        updated_at: Date.now(),
      });
    }
  },
});

// Update navbar text
export const updateNavbarText = mutation({
  args: {
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("siteSettings")
      .withIndex("by_key", (q) => q.eq("key", "main"))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        navbarText: args.text,
        updated_at: Date.now(),
      });
    } else {
      await ctx.db.insert("siteSettings", {
        key: "main",
        navbarText: args.text,
        updated_at: Date.now(),
      });
    }
  },
});

// Update feed news
export const updateFeedNews = mutation({
  args: {
    feedNews: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("siteSettings")
      .withIndex("by_key", (q) => q.eq("key", "main"))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        feedNews: args.feedNews,
        updated_at: Date.now(),
      });
    } else {
      await ctx.db.insert("siteSettings", {
        key: "main",
        feedNews: args.feedNews,
        updated_at: Date.now(),
      });
    }
  },
});

// Update portfolio images
export const updatePortfolioImages = mutation({
  args: {
    images: v.array(
      v.object({
        id: v.number(),
        img: v.string(),
        title: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("siteSettings")
      .withIndex("by_key", (q) => q.eq("key", "main"))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        portfolioImages: args.images,
        updated_at: Date.now(),
      });
    } else {
      await ctx.db.insert("siteSettings", {
        key: "main",
        portfolioImages: args.images,
        updated_at: Date.now(),
      });
    }
  },
});
