import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const add = mutation({
    args: {
        moduleId: v.id("modules"),
    },
    handler: async (ctx, { moduleId }) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Called createGroup without authenticated user");
        }
        const lessonId = await ctx.db.insert("lessons", {
            moduleId,
            title: "New Lesson",
            description: "New Lesson Description",
            youtubeUrl: "",
        });
        return lessonId;
    },
});

export const remove = mutation({
    args: {
        lessonId: v.id("lessons"),
    },
    handler: async (ctx, { lessonId }) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Called createGroup without authenticated user");
        }
        await ctx.db.delete(lessonId);
    },
});

export const update = mutation({
    args: {
        title: v.string(),
        description: v.string(),
        youtubeUrl: v.string(),
        lessonId: v.id("lessons"),
    },
    handler: async (ctx, { title, description, youtubeUrl, lessonId }) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Called createGroup without authenticated user");
        }
        await ctx.db.patch(lessonId, {
            title,
            description,
            youtubeUrl,
        });
    },
})