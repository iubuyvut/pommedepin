import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { createReservation, getReservationById, createReview, getApprovedReviews } from "./db";
import { z } from "zod";
import { sendReservationEmail } from "./_core/email";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  reservations: router({
    create: publicProcedure
      .input(z.object({
        date: z.string(),
        time: z.string(),
        guests: z.number(),
        name: z.string(),
        phone: z.string(),
        email: z.string().email(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const reservation = await createReservation({
          date: input.date,
          time: input.time,
          guests: input.guests,
          name: input.name,
          phone: input.phone,
          email: input.email,
          notes: input.notes || null,
          status: "confirmed",
        });

        // Send confirmation email
        try {
          await sendReservationEmail({
            email: reservation.email,
            name: reservation.name,
            date: reservation.date,
            time: reservation.time,
            guests: reservation.guests,
          });
        } catch (error) {
          console.error("Failed to send reservation email:", error);
        }

        return reservation;
      }),
    get: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getReservationById(input.id);
      }),
  }),

  reviews: router({
    create: publicProcedure
      .input(z.object({
        name: z.string().min(2),
        email: z.string().email(),
        rating: z.number().min(1).max(5),
        comment: z.string().min(10).max(1000),
      }))
      .mutation(async ({ input }) => {
        return createReview({
          name: input.name,
          email: input.email,
          rating: input.rating,
          comment: input.comment,
          status: "pending",
        });
      }),
    getApproved: publicProcedure
      .input(z.object({ limit: z.number().optional() }))
      .query(async ({ input }) => {
        return getApprovedReviews(input.limit || 10);
      }),
  }),
});

export type AppRouter = typeof appRouter;
