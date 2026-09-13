import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const SaveTripDetail = mutation({
  args: {
    tripId: v.string(),
    email: v.string(),
    tripDetail: v.any(),
  },

  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("UserTable")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (!user) {
      throw new Error("User not found. Please sign in before saving itinerary.");
    }

    const existingTrip = await ctx.db
      .query("TripDetailTable")
      .filter((q) => q.eq(q.field("tripId"), args.tripId))
      .first();

    if (existingTrip) {
      return existingTrip;
    }

    const savedTrip = await ctx.db.insert("TripDetailTable", {
      tripId: args.tripId,
      userId: user._id,
      tripDetail: args.tripDetail,
      createdAt: Date.now(),
    });

    return {
      _id: savedTrip,
      tripId: args.tripId,
      userId: user._id,
      tripDetail: args.tripDetail,
      createdAt: Date.now(),
    };
  },
});

export const getUserTrips = query({
  args: {
    email: v.string(),
  },

  handler: async (ctx, args) => {
    if (!args.email.trim()) {
      return [];
    }

    const user = await ctx.db
      .query("UserTable")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (!user) {
      return [];
    }

    return await ctx.db
      .query("TripDetailTable")
      .filter((q) => q.eq(q.field("userId"), user._id))
      .order("desc")
      .collect();
  },
});
