import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import {
  createWorkspace,
  getWorkspacesByUserId,
  createParticipant,
  getParticipantsByWorkspace,
  createExpense,
  getExpensesByWorkspace,
  createExpenseSplit,
  calculateSettlements,
  createJustificatif,
  getJustificatifsByExpense,
  logAudit,
} from "./db";
import { z } from "zod";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============ WORKSPACE PROCEDURES ============
  workspaces: router({
    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1).max(255),
          slug: z.string().min(1).max(255),
          description: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const workspace = await createWorkspace(
          ctx.user.id,
          input.name,
          input.slug,
          input.description
        );

        await logAudit(
          workspace[0].insertId as any,
          ctx.user.id,
          "CREATE_WORKSPACE",
          "workspace",
          workspace[0].insertId as any,
          { name: input.name }
        );

        return workspace;
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      return await getWorkspacesByUserId(ctx.user.id);
    }),
  }),

  // ============ PARTICIPANT PROCEDURES ============
  participants: router({
    create: protectedProcedure
      .input(
        z.object({
          workspaceId: z.number(),
          name: z.string().min(1).max(255),
          email: z.string().email().optional(),
          color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const participant = await createParticipant(
          input.workspaceId,
          input.name,
          input.email,
          input.color
        );

        await logAudit(
          input.workspaceId,
          ctx.user.id,
          "CREATE_PARTICIPANT",
          "participant",
          participant[0].insertId as any,
          { name: input.name }
        );

        return participant;
      }),

    list: protectedProcedure
      .input(z.object({ workspaceId: z.number() }))
      .query(async ({ input }) => {
        return await getParticipantsByWorkspace(input.workspaceId);
      }),
  }),

  // ============ EXPENSE PROCEDURES ============
  expenses: router({
    create: protectedProcedure
      .input(
        z.object({
          workspaceId: z.number(),
          categoryId: z.number(),
          paidByParticipantId: z.number(),
          description: z.string().min(1).max(255),
          amount: z.string().regex(/^\d+(\.\d{1,2})?$/), // Strict decimal validation
          currency: z.string().default("EUR"),
          date: z.date(),
          notes: z.string().optional(),
          splits: z
            .array(
              z.object({
                participantId: z.number(),
                splitType: z.enum(["equal", "percentage", "fixed"]),
                value: z.string().optional(),
              })
            )
            .optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const expense = await createExpense(
          input.workspaceId,
          input.categoryId,
          input.paidByParticipantId,
          input.description,
          input.amount,
          input.currency,
          input.date,
          input.notes
        );

        // Create expense splits
        if (input.splits && input.splits.length > 0) {
          const expenseAmount = parseFloat(input.amount);
          const splits = input.splits;

          if (input.splits[0].splitType === "equal") {
            const amountPerPerson = expenseAmount / splits.length;
            for (const split of splits) {
              await createExpenseSplit(
                expense[0].insertId as any,
                split.participantId,
                "equal",
                "",
                amountPerPerson.toString()
              );
            }
          } else if (input.splits[0].splitType === "percentage") {
            for (const split of splits) {
              const percentage = parseFloat(split.value || "0");
              const amount = (expenseAmount * percentage) / 100;
              await createExpenseSplit(
                expense[0].insertId as any,
                split.participantId,
                "percentage",
                split.value || "0",
                amount.toString()
              );
            }
          } else if (input.splits[0].splitType === "fixed") {
            for (const split of splits) {
              await createExpenseSplit(
                expense[0].insertId as any,
                split.participantId,
                "fixed",
                split.value || "0",
                split.value || "0"
              );
            }
          }
        }

        await logAudit(
          input.workspaceId,
          ctx.user.id,
          "CREATE_EXPENSE",
          "expense",
          expense[0].insertId as any,
          { description: input.description, amount: input.amount }
        );

        return expense;
      }),

    list: protectedProcedure
      .input(z.object({ workspaceId: z.number() }))
      .query(async ({ input }) => {
        return await getExpensesByWorkspace(input.workspaceId);
      }),
  }),

  // ============ SETTLEMENT PROCEDURES ============
  settlements: router({
    calculate: protectedProcedure
      .input(z.object({ workspaceId: z.number() }))
      .query(async ({ input }) => {
        return await calculateSettlements(input.workspaceId);
      }),
  }),

  // ============ JUSTIFICATIF PROCEDURES ============
  justificatifs: router({
    create: protectedProcedure
      .input(
        z.object({
          expenseId: z.number(),
          fileName: z.string(),
          fileUrl: z.string(),
          fileSize: z.number(),
          mimeType: z.string(),
          ocrData: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        return await createJustificatif(
          input.expenseId,
          input.fileName,
          input.fileUrl,
          input.fileSize,
          input.mimeType,
          input.ocrData
        );
      }),

    list: protectedProcedure
      .input(z.object({ expenseId: z.number() }))
      .query(async ({ input }) => {
        return await getJustificatifsByExpense(input.expenseId);
      }),
  }),
});

export type AppRouter = typeof appRouter;
