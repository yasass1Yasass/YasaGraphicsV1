import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  designs: defineTable({
    title: v.string(),
    description: v.string(),
    category: v.string(),
    price_lkr: v.number(),
    image: v.optional(v.string()),
    video: v.optional(v.string()),
    badge: v.optional(v.string()),
    discount_enabled: v.optional(v.boolean()),
    discount_percentage: v.optional(v.number()),
    created_at: v.number(),
    updated_at: v.optional(v.number()),
  })
    .index("by_category", ["category"])
    .index("by_created_at", ["created_at"]),

  profiling: defineTable({
    category: v.string(),
    title: v.string(),
    description: v.string(),
    image_url: v.optional(v.string()),
    video_url: v.optional(v.string()),
    url: v.optional(v.string()),
    created_at: v.number(),
    updated_at: v.optional(v.number()),
  })
    .index("by_category", ["category"])
    .index("by_created_at", ["created_at"]),

  users: defineTable({
    username: v.string(),
    password: v.string(), // Hashed password
    email: v.optional(v.string()),
    role: v.string(),
    created_at: v.number(),
    updated_at: v.optional(v.number()),
  })
    .index("by_username", ["username"]),

  siteSettings: defineTable({
    key: v.string(), // unique key like "main"
    heroTitle: v.optional(v.string()),
    heroSubtitle: v.optional(v.string()),
    heroDescription: v.optional(v.string()),
    portfolioHeading: v.optional(v.string()),
    navbarText: v.optional(v.string()),
    feedNews: v.optional(v.string()), // pipe-separated items
    portfolioImages: v.optional(v.array(v.object({
      id: v.number(),
      img: v.string(),
      title: v.string(),
    }))),
    updated_at: v.number(),
  })
    .index("by_key", ["key"]),
});

