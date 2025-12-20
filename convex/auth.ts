import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Hardcoded admin credentials (matching existing backend)
const ADMIN_USERNAME = "yasagraphicsadmin";
const ADMIN_PASSWORD = "admin@@@@18007";

// Simple token generation
function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export const login = mutation({
  args: {
    username: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // Validate credentials
    if (args.username === ADMIN_USERNAME && args.password === ADMIN_PASSWORD) {
      const token = generateToken();
      const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
      
      // Store session in Convex database
      await ctx.db.insert("adminSessions", {
        token,
        username: ADMIN_USERNAME,
        expiresAt,
        created_at: Date.now(),
      });

      return {
        success: true,
        token,
        expiresAt,
        admin: {
          username: ADMIN_USERNAME,
          role: "admin",
        },
      };
    }

    throw new Error("Invalid credentials");
  },
});

export const verifySession = query({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if token exists in database and is not expired
    const session = await ctx.db
      .query("adminSessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session) {
      return { valid: false, admin: null };
    }

    // Check if session is expired
    if (session.expiresAt < Date.now()) {
      await ctx.db.delete(session._id);
      return { valid: false, admin: null };
    }

    return {
      valid: true,
      admin: { username: session.username, role: "admin" },
    };
  },
});

// Logout - remove session from database
export const logout = mutation({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("adminSessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (session) {
      await ctx.db.delete(session._id);
    }

    return { success: true };
  },
});

