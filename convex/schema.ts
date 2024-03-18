import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        tokenIdentifier: v.string(),
        name: v.string(),
        profileUrl: v.optional(v.string()),
        about: v.optional(v.string()),
        email: v.string(),
    })
        .index("by_token", ["tokenIdentifier"])
        .index("by_email", ["email"]),
    groups: defineTable({
        name: v.string(),
        description: v.optional(v.string()),
        shortDescription: v.optional(v.string()),
        aboutUrl: v.optional(v.string()),
        ownerId: v.id("users"),
        price: v.number(),
        memberNumber: v.number(),
        endsOn: v.optional(v.number()),
        subscriptionId: v.optional(v.string()),
    })
        .index("by_name", ["name"])
        .index("by_ownerId", ["ownerId"])
        .index("by_subscriptionId", ["subscriptionId"]),
    userGroups: defineTable({
        userId: v.id("users"),
        groupId: v.id("groups"),
    })
        .index("by_userId", ["userId"])
        .index("by_groupId", ["groupId"]),
    posts: defineTable({
        title: v.string(),
        content: v.string(),
        authorId: v.id("users"),
        groupId: v.id("groups"),
        lessonId: v.optional(v.id("lessons")),
    })
        .index("by_title", ["title"])
        .index("by_groupId", ["groupId"]),
    comments: defineTable({
        postId: v.id("posts"),
        content: v.string(),
        authorId: v.id("users"),
    })
        .index("by_postId", ["postId"]),
    likes: defineTable({
        postId: v.id("posts"),
        userId: v.id("users"),
    })
        .index("by_postId", ["postId"])
        .index("by_postId_userId", ["postId", "userId"]),
    courses: defineTable({
        title: v.string(),
        description: v.string(),
        groupId: v.id("groups"),
    })
        .index("by_groupId", ["groupId"]),
    modules: defineTable({
        title: v.string(),
        courseId: v.id("courses"),
    })
        .index("by_courseId", ["courseId"]),
    lessons: defineTable({
        title: v.string(),
        description: v.string(),
        moduleId: v.id("modules"),
        youtubeUrl: v.string(),
    })
        .index("by_moduleId", ["moduleId"]),
})