import { pgTable, text, serial, integer, real, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const calculations = pgTable("calculations", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => students.id),
  distance: real("distance").notNull(),
  transportMethod: text("transport_method").notNull(),
  hydrationHabit: text("hydration_habit").notNull(),
  packagingHabit: text("packaging_habit").notNull(),
  dailyEmissions: real("daily_emissions").notNull(),
  weeklyEmissions: real("weekly_emissions").notNull(),
  yearlyEmissions: real("yearly_emissions").notNull(),
  calculatedAt: timestamp("calculated_at").defaultNow().notNull(),
});

export const emailReports = pgTable("email_reports", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => students.id).notNull(),
  calculationId: integer("calculation_id").references(() => calculations.id).notNull(),
  emailSent: timestamp("email_sent").defaultNow().notNull(),
  reportData: jsonb("report_data").notNull(),
});

export const insertStudentSchema = createInsertSchema(students).omit({
  id: true,
  createdAt: true,
});

export const insertCalculationSchema = createInsertSchema(calculations).omit({
  id: true,
  calculatedAt: true,
});

export const insertEmailReportSchema = createInsertSchema(emailReports).omit({
  id: true,
  emailSent: true,
});

export type Student = typeof students.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Calculation = typeof calculations.$inferSelect;
export type InsertCalculation = z.infer<typeof insertCalculationSchema>;
export type EmailReport = typeof emailReports.$inferSelect;
export type InsertEmailReport = z.infer<typeof insertEmailReportSchema>;

// Transport emission factors (kg CO₂e per km)
export const EMISSION_FACTORS = {
  walking: 0,
  bicycle: 0,
  'car-solo': 0.171,
  'car-shared': 0.085,
  motorcycle: 0.113,
  'public-transport': 0.089,
  train: 0.041,
  'electric-car': 0.053,
} as const;

// Daily emission factors
export const HYDRATION_FACTORS = {
  'plastic-bottle': 0.1, // per day
  'steel-bottle': 0.01,  // amortized
  'soft-drinks': 0.15,   // per day
} as const;

export const PACKAGING_FACTORS = {
  'aluminum-foil': 0.05, // per day
  'zero-waste': 0,
} as const;

export type TransportMethod = keyof typeof EMISSION_FACTORS;
export type HydrationHabit = keyof typeof HYDRATION_FACTORS;
export type PackagingHabit = keyof typeof PACKAGING_FACTORS;
