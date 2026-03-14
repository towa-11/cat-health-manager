import { decimal, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Cat profiles table - stores information about each cat
 */
export const cats = mysqlTable("cats", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  age: int("age"),
  breed: varchar("breed", { length: 100 }),
  photoUrl: text("photoUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Cat = typeof cats.$inferSelect;
export type InsertCat = typeof cats.$inferInsert;

/**
 * Weight records table - tracks cat weight over time
 */
export const weightRecords = mysqlTable("weightRecords", {
  id: int("id").autoincrement().primaryKey(),
  catId: int("catId").notNull(),
  weight: decimal("weight", { precision: 5, scale: 2 }).notNull(),
  recordDate: timestamp("recordDate").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type WeightRecord = typeof weightRecords.$inferSelect;
export type InsertWeightRecord = typeof weightRecords.$inferInsert;

/**
 * Meal records table - tracks feeding information
 */
export const mealRecords = mysqlTable("mealRecords", {
  id: int("id").autoincrement().primaryKey(),
  catId: int("catId").notNull(),
  recordTime: timestamp("recordTime").notNull(),
  amount: varchar("amount", { length: 100 }),
  foodType: varchar("foodType", { length: 100 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MealRecord = typeof mealRecords.$inferSelect;
export type InsertMealRecord = typeof mealRecords.$inferInsert;

/**
 * Excretion records table - tracks bathroom habits and abnormalities
 */
export const excretionRecords = mysqlTable("excretionRecords", {
  id: int("id").autoincrement().primaryKey(),
  catId: int("catId").notNull(),
  recordTime: timestamp("recordTime").notNull(),
  type: mysqlEnum("type", ["urine", "feces"]).notNull(),
  status: varchar("status", { length: 100 }),
  hasAbnormality: int("hasAbnormality").default(0),
  abnormalityDetails: text("abnormalityDetails"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ExcretionRecord = typeof excretionRecords.$inferSelect;
export type InsertExcretionRecord = typeof excretionRecords.$inferInsert;

/**
 * Health symptom records table - tracks energy, appetite, and symptoms
 */
export const healthRecords = mysqlTable("healthRecords", {
  id: int("id").autoincrement().primaryKey(),
  catId: int("catId").notNull(),
  recordDate: timestamp("recordDate").notNull(),
  energyLevel: int("energyLevel"),
  appetite: int("appetite"),
  hasVomiting: int("hasVomiting").default(0),
  hasDiarrhea: int("hasDiarrhea").default(0),
  otherSymptoms: text("otherSymptoms"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type HealthRecord = typeof healthRecords.$inferSelect;
export type InsertHealthRecord = typeof healthRecords.$inferInsert;

// Relations
export const catsRelations = relations(cats, ({ many }) => ({
  weightRecords: many(weightRecords),
  mealRecords: many(mealRecords),
  excretionRecords: many(excretionRecords),
  healthRecords: many(healthRecords),
}));

export const weightRecordsRelations = relations(weightRecords, ({ one }) => ({
  cat: one(cats, {
    fields: [weightRecords.catId],
    references: [cats.id],
  }),
}));

export const mealRecordsRelations = relations(mealRecords, ({ one }) => ({
  cat: one(cats, {
    fields: [mealRecords.catId],
    references: [cats.id],
  }),
}));

export const excretionRecordsRelations = relations(excretionRecords, ({ one }) => ({
  cat: one(cats, {
    fields: [excretionRecords.catId],
    references: [cats.id],
  }),
}));

export const healthRecordsRelations = relations(healthRecords, ({ one }) => ({
  cat: one(cats, {
    fields: [healthRecords.catId],
    references: [cats.id],
  }),
}));
