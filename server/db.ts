import { eq, and, sum, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  workspaces,
  participants,
  expenses,
  expenseSplits,
  settlements,
  categories,
  justificatifs,
  auditLogs,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

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

// ============ USER FUNCTIONS ============

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
      values.role = "admin";
      updateSet.role = "admin";
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

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ WORKSPACE FUNCTIONS ============

export async function createWorkspace(
  ownerId: number,
  name: string,
  slug: string,
  description?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(workspaces).values({
    name,
    slug,
    description,
    ownerId,
  });

  return result;
}

export async function getWorkspacesByUserId(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .select()
    .from(workspaces)
    .where(eq(workspaces.ownerId, userId));
}

// ============ PARTICIPANT FUNCTIONS ============

export async function createParticipant(
  workspaceId: number,
  name: string,
  email?: string,
  color?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(participants).values({
    workspaceId,
    name,
    email,
    color,
  });
}

export async function getParticipantsByWorkspace(workspaceId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .select()
    .from(participants)
    .where(eq(participants.workspaceId, workspaceId));
}

// ============ EXPENSE FUNCTIONS ============

export async function createExpense(
  workspaceId: number,
  categoryId: number,
  paidByParticipantId: number,
  description: string,
  amount: string,
  currency: string = "EUR",
  date: Date,
  notes?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Validate amount is a valid decimal
  const decimalAmount = parseFloat(amount);
  if (isNaN(decimalAmount) || decimalAmount < 0) {
    throw new Error("Invalid expense amount");
  }

  return await db.insert(expenses).values({
    workspaceId,
    categoryId,
    paidByParticipantId,
    description,
    amount: decimalAmount.toString(),
    currency,
    date,
    notes,
  });
}

export async function getExpensesByWorkspace(workspaceId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .select()
    .from(expenses)
    .where(eq(expenses.workspaceId, workspaceId));
}

// ============ EXPENSE SPLIT FUNCTIONS ============

export async function createExpenseSplit(
  expenseId: number,
  participantId: number,
  splitType: "equal" | "percentage" | "fixed",
  value: string,
  amount: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(expenseSplits).values({
    expenseId,
    participantId,
    splitType,
    value: value ? parseFloat(value).toString() : "0",
    amount: parseFloat(amount).toString(),
  });
}

// ============ SETTLEMENT CALCULATION ============

export async function calculateSettlements(workspaceId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Get all expenses and splits for the workspace
  const allExpenses = await db
    .select()
    .from(expenses)
    .where(eq(expenses.workspaceId, workspaceId));

  const allSplits = await db
    .select()
    .from(expenseSplits)
    .where(
      sql`${expenseSplits.expenseId} IN (SELECT id FROM ${expenses} WHERE workspaceId = ${workspaceId})`
    );

  // Calculate net balances for each participant
  const balances: Record<number, number> = {};

  for (const expense of allExpenses) {
    const expenseAmount = parseFloat(expense.amount as any);
    const splits = allSplits.filter((s) => s.expenseId === expense.id);

    for (const split of splits) {
      const splitAmount = parseFloat(split.amount as any);
      if (!balances[split.participantId]) {
        balances[split.participantId] = 0;
      }
      balances[split.participantId] -= splitAmount;
    }

    if (!balances[expense.paidByParticipantId]) {
      balances[expense.paidByParticipantId] = 0;
    }
    balances[expense.paidByParticipantId] += expenseAmount;
  }

  // Generate settlements
  const settlements: Array<{
    fromParticipantId: number;
    toParticipantId: number;
    amount: number;
  }> = [];

  const debtors = Object.entries(balances)
    .filter(([_, balance]) => balance < 0)
    .map(([id, balance]) => ({ id: parseInt(id), balance }));

  const creditors = Object.entries(balances)
    .filter(([_, balance]) => balance > 0)
    .map(([id, balance]) => ({ id: parseInt(id), balance }));

  // Simple greedy algorithm to match debtors with creditors
  for (const debtor of debtors) {
    for (const creditor of creditors) {
      if (creditor.balance <= 0) continue;

      const amount = Math.min(-debtor.balance, creditor.balance);
      settlements.push({
        fromParticipantId: debtor.id,
        toParticipantId: creditor.id,
        amount: Math.round(amount * 100) / 100, // Round to 2 decimals
      });

      debtor.balance += amount;
      creditor.balance -= amount;
    }
  }

  return settlements;
}

// ============ JUSTIFICATIF FUNCTIONS ============

export async function createJustificatif(
  expenseId: number,
  fileName: string,
  fileUrl: string,
  fileSize: number,
  mimeType: string,
  ocrData?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(justificatifs).values({
    expenseId,
    fileName,
    fileUrl,
    fileSize,
    mimeType,
    ocrData,
  });
}

export async function getJustificatifsByExpense(expenseId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .select()
    .from(justificatifs)
    .where(eq(justificatifs.expenseId, expenseId));
}

// ============ AUDIT LOG FUNCTIONS ============

export async function logAudit(
  workspaceId: number,
  userId: number | null,
  action: string,
  entityType: string,
  entityId: number | null,
  changes?: Record<string, any>
) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot log audit: database not available");
    return;
  }

  try {
    await db.insert(auditLogs).values({
      workspaceId,
      userId,
      action,
      entityType,
      entityId,
      changes: changes ? JSON.stringify(changes) : null,
    });
  } catch (error) {
    console.error("[Database] Failed to log audit:", error);
  }
}
