import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import { getCatsByUserId, createCat, getWeightRecordsByCat, addWeightRecord, getMealRecordsByCat, addMealRecord, getExcretionRecordsByCat, addExcretionRecord, getHealthRecordsByCat, addHealthRecord } from "./db";

export const catsRouter = router({
  // Cat management
  list: protectedProcedure.query(async ({ ctx }) => {
    return getCatsByUserId(ctx.user.id);
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        age: z.number().optional(),
        breed: z.string().optional(),
        photoUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return createCat({
        userId: ctx.user.id,
        ...input,
      });
    }),

  // Weight records
  weight: router({
    list: protectedProcedure
      .input(z.object({ catId: z.number() }))
      .query(async ({ input }) => {
        return getWeightRecordsByCat(input.catId);
      }),

    add: protectedProcedure
      .input(
        z.object({
          catId: z.number(),
          weight: z.number(),
          recordDate: z.date(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return addWeightRecord({
          catId: input.catId,
          weight: input.weight.toString() as any,
          recordDate: input.recordDate,
          notes: input.notes,
        });
      }),
  }),

  // Meal records
  meal: router({
    list: protectedProcedure
      .input(z.object({ catId: z.number() }))
      .query(async ({ input }) => {
        return getMealRecordsByCat(input.catId);
      }),

    add: protectedProcedure
      .input(
        z.object({
          catId: z.number(),
          recordTime: z.date(),
          amount: z.string().optional(),
          foodType: z.string().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return addMealRecord({
          catId: input.catId,
          recordTime: input.recordTime,
          amount: input.amount,
          foodType: input.foodType,
          notes: input.notes,
        });
      }),
  }),

  // Excretion records
  excretion: router({
    list: protectedProcedure
      .input(z.object({ catId: z.number() }))
      .query(async ({ input }) => {
        return getExcretionRecordsByCat(input.catId);
      }),

    add: protectedProcedure
      .input(
        z.object({
          catId: z.number(),
          recordTime: z.date(),
          type: z.enum(["urine", "feces"]),
          status: z.string().optional(),
          hasAbnormality: z.number().optional(),
          abnormalityDetails: z.string().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return addExcretionRecord({
          catId: input.catId,
          recordTime: input.recordTime,
          type: input.type,
          status: input.status,
          hasAbnormality: input.hasAbnormality,
          abnormalityDetails: input.abnormalityDetails,
          notes: input.notes,
        });
      }),
  }),

  // Health records
  health: router({
    list: protectedProcedure
      .input(z.object({ catId: z.number() }))
      .query(async ({ input }) => {
        return getHealthRecordsByCat(input.catId);
      }),

    add: protectedProcedure
      .input(
        z.object({
          catId: z.number(),
          recordDate: z.date(),
          energyLevel: z.number().optional(),
          appetite: z.number().optional(),
          hasVomiting: z.number().optional(),
          hasDiarrhea: z.number().optional(),
          otherSymptoms: z.string().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return addHealthRecord({
          catId: input.catId,
          recordDate: input.recordDate,
          energyLevel: input.energyLevel,
          appetite: input.appetite,
          hasVomiting: input.hasVomiting,
          hasDiarrhea: input.hasDiarrhea,
          otherSymptoms: input.otherSymptoms,
          notes: input.notes,
        });
      }),
  }),
});
