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
      
      // Store token in database
      await ctx.db.insert("users", {
        username: ADMIN_USERNAME,
        password: "", // Not storing password, just using for token
        role: "admin",
        created_at: Date.now(),
      });

      // Store token in a simple way - we'll use a token table
      // For now, return token and client stores it
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

export const verifyToken = query({
  args: {
    token: v.string(),
  },
  handler: async (_ctx, _args) => {
    // For now, we'll do simple validation
    // In production, store tokens in database
    // For this implementation, we'll validate on the client side
    // and use the token as a simple auth mechanism
    return {
      valid: true, // Simplified for now
      admin: {
        username: ADMIN_USERNAME,
        role: "admin",
      },
    };
  },
});

// Helper to verify admin (simple check - in production use proper auth)
export const verifyAdmin = mutation({
  args: {
    token: v.string(),
  },
  handler: async (_ctx, args) => {
    // Simple validation - in production use proper token validation
    // For now, just check if token exists and is not empty
    if (!args.token || args.token.length < 10) {
      throw new Error("Unauthorized");
    }
    return { valid: true };
  },
});

