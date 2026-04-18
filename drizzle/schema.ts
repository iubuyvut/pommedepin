import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  longtext,
  boolean,
  json,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Workspaces/Organizations for multi-tenant SaaS
 */
export const workspaces = mysqlTable("workspaces", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  ownerId: int("ownerId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Workspace = typeof workspaces.$inferSelect;
export type InsertWorkspace = typeof workspaces.$inferInsert;

/**
 * Workspace members
 */
export const workspaceMembers = mysqlTable("workspace_members", {
  id: int("id").autoincrement().primaryKey(),
  workspaceId: int("workspaceId").notNull(),
  userId: int("userId").notNull(),
  role: mysqlEnum("role", ["admin", "member"]).default("member").notNull(),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
});

export type WorkspaceMember = typeof workspaceMembers.$inferSelect;
export type InsertWorkspaceMember = typeof workspaceMembers.$inferInsert;

/**
 * Participants in a workspace (people who share expenses)
 */
export const participants = mysqlTable("participants", {
  id: int("id").autoincrement().primaryKey(),
  workspaceId: int("workspaceId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  color: varchar("color", { length: 7 }).default("#0047AB"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Participant = typeof participants.$inferSelect;
export type InsertParticipant = typeof participants.$inferInsert;

/**
 * Expense categories with hierarchical structure
 */
export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  workspaceId: int("workspaceId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 50 }).notNull(), // Accounting code
  parentId: int("parentId"), // For hierarchical categories
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

/**
 * Expenses with advanced features
 */
export const expenses = mysqlTable("expenses", {
  id: int("id").autoincrement().primaryKey(),
  workspaceId: int("workspaceId").notNull(),
  categoryId: int("categoryId").notNull(),
  paidByParticipantId: int("paidByParticipantId").notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(), // Strict decimal for financial accuracy
  currency: varchar("currency", { length: 3 }).default("EUR").notNull(),
  date: timestamp("date").notNull(),
  notes: text("notes"),
  status: mysqlEnum("status", ["draft", "confirmed", "reconciled"]).default("draft").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Expense = typeof expenses.$inferSelect;
export type InsertExpense = typeof expenses.$inferInsert;

/**
 * Expense splits with advanced distribution (percentage, fixed, equal)
 */
export const expenseSplits = mysqlTable("expense_splits", {
  id: int("id").autoincrement().primaryKey(),
  expenseId: int("expenseId").notNull(),
  participantId: int("participantId").notNull(),
  splitType: mysqlEnum("splitType", ["equal", "percentage", "fixed"]).default("equal").notNull(),
  value: decimal("value", { precision: 10, scale: 2 }).notNull(), // Percentage (0-100), fixed amount, or null for equal
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(), // Calculated amount owed
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ExpenseSplit = typeof expenseSplits.$inferSelect;
export type InsertExpenseSplit = typeof expenseSplits.$inferInsert;

/**
 * Justificatifs/Receipts with OCR ready structure
 */
export const justificatifs = mysqlTable("justificatifs", {
  id: int("id").autoincrement().primaryKey(),
  expenseId: int("expenseId").notNull(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileUrl: varchar("fileUrl", { length: 500 }).notNull(), // S3 URL
  fileSize: int("fileSize").notNull(), // in bytes
  mimeType: varchar("mimeType", { length: 50 }).notNull(),
  ocrData: longtext("ocrData"), // JSON with OCR extracted data (ready for future OCR integration)
  uploadedAt: timestamp("uploadedAt").defaultNow().notNull(),
});

export type Justificatif = typeof justificatifs.$inferSelect;
export type InsertJustificatif = typeof justificatifs.$inferInsert;

/**
 * Settlement transactions (who owes whom and how much)
 */
export const settlements = mysqlTable("settlements", {
  id: int("id").autoincrement().primaryKey(),
  workspaceId: int("workspaceId").notNull(),
  fromParticipantId: int("fromParticipantId").notNull(),
  toParticipantId: int("toParticipantId").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("EUR").notNull(),
  status: mysqlEnum("status", ["pending", "paid", "cancelled"]).default("pending").notNull(),
  paidAt: timestamp("paidAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Settlement = typeof settlements.$inferSelect;
export type InsertSettlement = typeof settlements.$inferInsert;

/**
 * Audit log for compliance and tracking
 */
export const auditLogs = mysqlTable("audit_logs", {
  id: int("id").autoincrement().primaryKey(),
  workspaceId: int("workspaceId").notNull(),
  userId: int("userId"),
  action: varchar("action", { length: 255 }).notNull(),
  entityType: varchar("entityType", { length: 50 }).notNull(),
  entityId: int("entityId"),
  changes: json("changes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;
