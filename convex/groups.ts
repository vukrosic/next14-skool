import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
    args: { name: v.string(), description: v.optional(v.string()) },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Called storeUser without authenticated user");
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier))
            .unique();

        if (user === null) {
            return;
            throw new Error("User not stored in database.");
        }

        const groupId = await ctx.db.insert("groups", {
            name: args.name,
            description: args.description,
            ownerId: user._id,
            price: 0,
            memberNumber: 1,
        });

        const userGroup = await ctx.db.insert("userGroups", {
            userId: user._id,
            groupId: groupId,
        });

        return groupId;
    }
});


export const get = query({
    args: { id: v.optional(v.id("groups")) },
    handler: async (ctx, { id }) => {
        if (!id) {
            return null;
        }
        const group = await ctx.db.get(id);
        return group;
    },
});