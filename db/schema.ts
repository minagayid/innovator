import { index, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  displayName: text("display_name").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const projects = sqliteTable("projects", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  ownerId: text("owner_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  category: text("category").notNull(),
  status: text("status").notNull().default("draft"),
  readinessStage: text("readiness_stage").notNull().default("Structured concept"),
  visibility: text("visibility").notNull().default("private"),
  documentKey: text("document_key").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
}, (table) => [
  index("projects_owner_idx").on(table.ownerId),
  index("projects_visibility_idx").on(table.visibility),
  index("projects_updated_idx").on(table.updatedAt),
]);
