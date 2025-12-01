import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createUser = mutation({
  args: {
    username: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", q => q.eq("email", args.email))
      .first();
    if (existing) return existing._id;
    const id = await ctx.db.insert("users", {
      username: args.username,
      email: args.email,
    });
    return id;
  },
});

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", q => q.eq("email", args.email))
      .first();
    return user ?? null;
  },
});

export const updateUser = mutation({
  args: {
    id: v.id("users"),
    username: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, username } = args;
    const patch = {};
    if (username !== undefined) patch.username = username;
    await ctx.db.patch(id, patch);
    return id;
  },
});
