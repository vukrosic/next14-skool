import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const add = mutation({
    args: {
        courseId: v.id("courses"),
    },
    handler: async (ctx, { courseId }) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Called createGroup without authenticated user");
        }
        const lessonId = await ctx.db.insert("modules", {
            courseId,
            title: "New Module",
        });
        return lessonId;
    },
});

export const remove = mutation({
    args: {
        moduleId: v.id("modules"),
    },
    handler: async (ctx, { moduleId }) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Called createGroup without authenticated user");
        }
        await ctx.db.delete(moduleId);
    },
})

export const updateTitle = mutation({
    args: {
        id: v.id("modules"),
        title: v.string(),
    },
    handler: async (ctx, { id, title }) => {
        await ctx.db.patch(id, { title });
    },
});