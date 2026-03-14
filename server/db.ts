import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, cats, Cat, InsertCat, weightRecords, WeightRecord, InsertWeightRecord, mealRecords, MealRecord, InsertMealRecord, excretionRecords, ExcretionRecord, InsertExcretionRecord, healthRecords, HealthRecord, InsertHealthRecord } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Cat management queries
export async function getCatsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(cats).where(eq(cats.userId, userId));
}

export async function createCat(data: InsertCat) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(cats).values(data);
  return result;
}

// Weight records queries
export async function getWeightRecordsByCat(catId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(weightRecords).where(eq(weightRecords.catId, catId));
}

export async function addWeightRecord(data: InsertWeightRecord) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(weightRecords).values(data);
}

// Meal records queries
export async function getMealRecordsByCat(catId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(mealRecords).where(eq(mealRecords.catId, catId));
}

export async function addMealRecord(data: InsertMealRecord) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(mealRecords).values(data);
}

// Excretion records queries
export async function getExcretionRecordsByCat(catId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(excretionRecords).where(eq(excretionRecords.catId, catId));
}

export async function addExcretionRecord(data: InsertExcretionRecord) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(excretionRecords).values(data);
}

// Health records queries
export async function getHealthRecordsByCat(catId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(healthRecords).where(eq(healthRecords.catId, catId));
}

export async function addHealthRecord(data: InsertHealthRecord) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(healthRecords).values(data);
}
