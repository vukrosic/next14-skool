import { v } from "convex/values";
import { mutation, query } from "./_generated/server";


export const store = mutation({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Called storeUser without authenticated user");
        }

        // check if user is already stored
        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier))
            .unique();

        if (user !== null) {
            return user._id;
        }

        const userId = await ctx.db.insert("users", {
            tokenIdentifier: identity.tokenIdentifier,
            name: identity.name!,
            profileUrl: identity.profileUrl,
            email: identity.email!,
        });

        return userId;
    }
});



export const currentUser = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Called selectGPT without authenticated user");
        }

        return await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier))
            .unique();
    }
})


export const addToGroup = mutation({
    args: {
        email: v.string(),
        groupId: v.id("groups"),
    },
    handler: async (ctx, { email, groupId }) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Called addToGroup without authenticated user");
        }

        const currentUser = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier))
            .unique();

        if (!currentUser) {
            throw new Error("User not found!");
        }

        const group = await ctx.db.get(groupId);

        if (!group) {
            throw new Error("Group not found!");
        }

        if (currentUser._id !== group.ownerId) {
            return;
            throw new Error("User is not the owner of the group!");
        }

        const newUser = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", email))
            .unique();

        if (!newUser) {
            throw new Error("User not found!");
        }

        await ctx.db.insert("userGroups", {
            userId: newUser._id,
            groupId
        })
    },
});