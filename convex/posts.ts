import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
    args: { groupId: v.id("groups") },
    handler: async (ctx, { groupId }) => {
        const posts = await ctx.db
            .query("posts")
            .withIndex("by_groupId", (q) => q.eq("groupId", groupId))
            .collect();

        const postsWithAuthors = await Promise.all(
            posts.map(async (post) => {
                const author = await ctx.db.get(post.authorId);
                if (!author) {
                    throw new Error("Author not found");
                }
                return {
                    ...post,
                    author,
                };
            })
        );

        const postsWithAuthorsAndComments = await Promise.all(
            postsWithAuthors.map(async (post) => {
                const comments = await ctx.db
                    .query("comments")
                    .withIndex("by_postId", (q) => q.eq("postId", post._id))
                    .collect();

                const commentsWithAuthors = await Promise.all(
                    comments.map(async (comment) => {
                        const author = await ctx.db.get(comment.authorId);
                        if (!author) {
                            throw new Error("Author not found");
                        }
                        return {
                            ...comment,
                            author,
                        };
                    })
                );

                return {
                    ...post,
                    comments: commentsWithAuthors,
                };
            })
        );

        const postsWithAuthorsAndCommentsAndLikes = await Promise.all(
            postsWithAuthorsAndComments.map(async (post) => {
                const likes = await ctx.db
                    .query("likes")
                    .withIndex("by_postId", (q) => q.eq("postId", post._id))
                    .collect();

                return {
                    ...post,
                    likes,
                };
            })
        );
        return postsWithAuthorsAndCommentsAndLikes;
    }
});


export const create = mutation({
    args: {
        title: v.string(),
        content: v.string(),
        groupId: v.id("groups"),
    },
    handler: async (ctx, { title, content, groupId }) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Called createGroup without authenticated user");
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier))
            .unique();

        if (!user) {
            throw new Error("User not found");
        }

        const postId = await ctx.db.insert("posts", {
            title,
            content,
            authorId: user._id,
            groupId,
        });

        return postId;
    }
});



export const remove = mutation({
    args: { id: v.id("posts") },
    handler: async (ctx, { id }) => {

        // delete all comments
        const comments = await ctx.db
            .query("comments")
            .withIndex("by_postId", (q) => q.eq("postId", id))
            .collect();

        await Promise.all(comments.map(async (comment) => {
            await ctx.db.delete(comment._id);
        }));

        // delete all likes
        const likes = await ctx.db
            .query("likes")
            .withIndex("by_postId", (q) => q.eq("postId", id))
            .collect();

        await Promise.all(likes.map(async (like) => {
            await ctx.db.delete(like._id);
        }));

        // delete the post
        await ctx.db.delete(id);
    },
});


export const updateContent = mutation({
    args: { id: v.id("posts"), content: v.string() },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Unauthorized");
        }

        const content = args.content.trim();

        if (!content) {
            throw new Error("Content is required");
        }

        if (content.length > 40000) {
            throw new Error("Content is too long!")
        }

        const post = await ctx.db.patch(args.id, {
            content: args.content,
        });

        return post;
    },
});