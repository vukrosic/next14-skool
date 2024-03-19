import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";

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


export const list = query({
    args: {},
    handler: async (ctx) => {
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
            throw new Error("User not stored in database.");
        }

        const userGroups = await ctx.db
            .query("userGroups")
            .withIndex("by_userId", (q) => q.eq("userId", user._id))
            .collect();

        // now get all groups that this user belongs to
        const groups = userGroups.map(async (userGroup) => {
            const group = await ctx.db.get(userGroup.groupId);
            return group;
        });

        const resolvedGroups = await Promise.all(groups);

        const filteredGroups = resolvedGroups.filter(group => group !== null) as Doc<"groups">[];

        return filteredGroups;
    }
});


export const getMembers = query({
    args: { id: v.id("groups") },
    handler: async (ctx, { id }) => {
        const members = await ctx.db
            .query("userGroups")
            .withIndex("by_groupId", (q) => q.eq("groupId", id))
            .collect();

        const resolvedMembers = await Promise.all(members.map(async (member) => {
            const user = await ctx.db.get(member.userId);
            return user;
        }));

        const filteredMembers = resolvedMembers.filter(member => member !== null) as Doc<"users">[];

        return filteredMembers;
    },
});


export const listAll = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Called storeUser without authenticated user");
        }

        const groups = await ctx.db.query("groups").collect();

        return groups;
    }
});


export const updateName = mutation({
    args: { id: v.id("groups"), name: v.string() },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Unauthorized");
        }

        const name = args.name.trim();

        if (!name) {
            throw new Error("name is required");
        }

        if (name.length > 60) {
            throw new Error("name cannot be longer than 60 characters")
        }

        const group = await ctx.db.patch(args.id, {
            name: args.name,
        });

        return group;
    },
});

export const updateDescription = mutation({
    args: { id: v.id("groups"), descripton: v.string() },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Unauthorized");
        }

        const description = args.descripton.trim();

        if (!description) {
            throw new Error("Description is required");
        }

        if (description.length > 40000) {
            throw new Error("Description is too long.")
        }

        const group = await ctx.db.patch(args.id, {
            description: args.descripton,
        });

        return group;
    },
});


//update subscription
export const updateSubscription = internalMutation({
    args: { subscriptionId: v.string(), groupId: v.id("groups"), endsOn: v.number() },
    handler: async (ctx, { subscriptionId, groupId, endsOn }) => {
        await ctx.db.patch(groupId, {
            subscriptionId: subscriptionId,
            endsOn: endsOn
        });
    },
});

//update subscription by id
export const updateSubscriptionById = internalMutation({
    args: { subscriptionId: v.string(), endsOn: v.number() },
    handler: async (ctx, { subscriptionId, endsOn }) => {
        const user = await ctx.db.query("groups")
            .withIndex("by_subscriptionId", (q) => q.eq("subscriptionId", subscriptionId))
            .unique();

        if (!user) {
            throw new Error("User not found!");
        }

        await ctx.db.patch(user._id, {
            endsOn: endsOn
        });
    },
});