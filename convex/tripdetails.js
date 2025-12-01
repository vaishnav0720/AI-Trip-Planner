import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const saveTripDetails = mutation({
  args: {
    userId: v.optional(v.id("users")),
    origin: v.string(),
    destination: v.string(),
    budget: v.string(),
    durationDays: v.number(),
    groupSize: v.string(),
    preferences: v.optional(v.string()),
    plan: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("tripDetails", {
      ...args,
      createdAt: Date.now(),
    });
    return id;
  },
});

export const saveTripDetailsOnce = mutation({
  args: {
    userId: v.optional(v.id("users")),
    origin: v.string(),
    destination: v.string(),
    budget: v.string(),
    durationDays: v.number(),
    groupSize: v.string(),
    preferences: v.optional(v.string()),
    plan: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const normalize = (val) => (val ?? '').toString().trim();
    const duration = Number.isFinite(args.durationDays) ? args.durationDays : 0;

    const all = await ctx.db.query("tripDetails").collect();
    const existing = all.find(doc => (
      normalize(doc.origin) === normalize(args.origin) &&
      normalize(doc.destination) === normalize(args.destination) &&
      normalize(doc.budget) === normalize(args.budget) &&
      Number(doc.durationDays || 0) === Number(duration) &&
      normalize(doc.groupSize) === normalize(args.groupSize)
    ));

    if (existing) return existing._id;

    const id = await ctx.db.insert("tripDetails", {
      ...args,
      createdAt: Date.now(),
    });
    return id;
  },
});

export const listTripsByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const trips = await ctx.db
      .query("tripDetails")
      .withIndex("by_user", q => q.eq("userId", args.userId))
      .collect();
    return trips;
  },
});

export const getTripById = query({
  args: { id: v.id("tripDetails") },
  handler: async (ctx, args) => {
    const doc = await ctx.db.get(args.id);
    return doc ?? null;
  },
});

export const listRecentTrips = query({
  args: {},
  handler: async (ctx) => {
    const trips = await ctx.db.query("tripDetails").collect();
    trips.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    return trips.slice(0, 10);
  },
});
