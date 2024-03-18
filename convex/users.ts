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