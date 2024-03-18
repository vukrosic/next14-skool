import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const add = mutation({
    args: { postId: v.id("posts") },
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
        }

        // check if user already liked the post
        const liked = await ctx.db
            .query("likes")
            .withIndex("by_postId_userId", (q) =>
                q.eq("postId", args.postId).eq("userId", user._id))
            .unique();

        if (liked) {
            await ctx.db.delete(liked._id);
        }
        else {
            await ctx.db.insert("likes", {
                postId: args.postId,
                userId: user._id,
            });
        }
    }
});