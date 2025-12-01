import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    username: v.string(),
    email: v.string()
  }).index("by_email", ["email"]),
  messages: defineTable({
    author: v.id("users"),
    body: v.string()
  }),
  trip_details: defineTable({
    userId: v.optional(v.id("users")),
    origin: v.string(),
    destination: v.string(),
    budget: v.string(),
    durationDays: v.number(),
    groupSize: v.string(),
    preferences: v.optional(v.string()),
    plan: v.optional(v.string()),
    createdAt: v.number()
  }).index("by_user", ["userId"])
});
