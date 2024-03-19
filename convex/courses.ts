import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
    args: { groupId: v.id("groups") },
    handler: async (ctx, args) => {
        const courses = await ctx.db.query("courses")
            .withIndex("by_groupId", (q) => q.eq("groupId", args.groupId))
            .collect();

        const coursesWithModules = await Promise.all(courses.map(async (course) => {
            const modules = await ctx.db.query("modules")
                .withIndex("by_courseId", (q) => q.eq("courseId", course._id))
                .collect();
            return { ...course, modules };
        }));

        const coursesWithModulesAndLessons = await Promise.all(coursesWithModules.map(async (course) => {
            const modulesWithLessons = await Promise.all(course.modules.map(async (module) => {
                const lessons = await ctx.db.query("lessons")
                    .withIndex("by_moduleId", (q) => q.eq("moduleId", module._id))
                    .collect();
                return { ...module, lessons };
            }));
            return { ...course, modules: modulesWithLessons };
        }));

        return coursesWithModulesAndLessons;
    }
});


export const create = mutation({
    args: {
        title: v.string(),
        description: v.string(),
        groupId: v.id("groups"),
    },
    handler: async (ctx, { title, description, groupId }) => {
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

        const courseId = await ctx.db.insert("courses", {
            title,
            description,
            groupId,
        });

        return courseId;
    }
})

export const get = query({
    args: { id: v.id("courses") },
    handler: async (ctx, args) => {
        const course = await ctx.db.get(args.id);
        if (!course) return null;
        const modules = await ctx.db.query("modules")
            .withIndex("by_courseId", (q) => q.eq("courseId", args.id))
            .collect();
        const modulesWithLessons = await Promise.all(modules.map(async (module) => {
            const lessons = await ctx.db.query("lessons")
                .withIndex("by_moduleId", (q) => q.eq("moduleId", module._id))
                .collect();
            return { ...module, lessons };
        }));
        return { ...course, modules: modulesWithLessons };
    }
});


export const updateTitle = mutation({
    args: {
        id: v.id("courses"),
        title: v.string(),
    },
    handler: async (ctx, { id, title }) => {
        await ctx.db.patch(id, { title });
    }
});

export const updateDescription = mutation({
    args: {
        id: v.id("courses"),
        description: v.string(),
    },
    handler: async (ctx, { id, description }) => {
        await ctx.db.patch(id, { description });
    }
});