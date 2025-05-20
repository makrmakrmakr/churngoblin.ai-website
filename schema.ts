import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Newsletter subscriptions schema
export const newsletterSubscriptions = pgTable("newsletter_subscriptions", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const newsletterSchema = createInsertSchema(newsletterSubscriptions).pick({
  email: true,
});

export type InsertNewsletterSubscription = z.infer<typeof newsletterSchema>;
export type NewsletterSubscription = typeof newsletterSubscriptions.$inferSelect;

// Contact form submissions schema
export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contactSchema = createInsertSchema(contactSubmissions).pick({
  name: true,
  email: true,
  company: true,
  message: true,
});

export type InsertContactSubmission = z.infer<typeof contactSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;

// Custom GPTs Directory Schema
export const customGpts = pgTable("custom_gpts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  useCase: text("use_case").notNull(),
  author: text("author").notNull(),
  url: text("url").notNull(),
  stars: integer("stars").default(0),
  dateAdded: timestamp("date_added").defaultNow().notNull(),
  isOpenSource: boolean("is_open_source").default(true),
  promptExamples: jsonb("prompt_examples").$type<string[]>(),
  userId: integer("user_id").references(() => users.id),
});

export const insertGptSchema = createInsertSchema(customGpts).pick({
  name: true,
  description: true,
  category: true,
  useCase: true,
  author: true,
  url: true,
  stars: true,
  isOpenSource: true,
  promptExamples: true,
  userId: true,
});

export type InsertCustomGpt = z.infer<typeof insertGptSchema>;
export type CustomGpt = typeof customGpts.$inferSelect;

// Forum Schema
export const forumCategories = pgTable("forum_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  slug: text("slug").notNull().unique(),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertForumCategorySchema = createInsertSchema(forumCategories).pick({
  name: true,
  description: true,
  slug: true,
  sortOrder: true,
});

export type InsertForumCategory = z.infer<typeof insertForumCategorySchema>;
export type ForumCategory = typeof forumCategories.$inferSelect;

export const forumTopics = pgTable("forum_topics", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  slug: text("slug").notNull().unique(),
  categoryId: integer("category_id").notNull().references(() => forumCategories.id),
  userId: integer("user_id").notNull().references(() => users.id),
  isPinned: boolean("is_pinned").default(false),
  isLocked: boolean("is_locked").default(false),
  viewCount: integer("view_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertForumTopicSchema = createInsertSchema(forumTopics).pick({
  title: true,
  content: true,
  categoryId: true,
  userId: true,
  isPinned: true,
  isLocked: true,
});

export type InsertForumTopic = z.infer<typeof insertForumTopicSchema>;
export type ForumTopic = typeof forumTopics.$inferSelect;

export const forumPosts = pgTable("forum_posts", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  topicId: integer("topic_id").notNull().references(() => forumTopics.id),
  userId: integer("user_id").notNull().references(() => users.id),
  isAnswer: boolean("is_answer").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertForumPostSchema = createInsertSchema(forumPosts).pick({
  content: true,
  topicId: true,
  userId: true,
  isAnswer: true,
});

export type InsertForumPost = z.infer<typeof insertForumPostSchema>;
export type ForumPost = typeof forumPosts.$inferSelect;
