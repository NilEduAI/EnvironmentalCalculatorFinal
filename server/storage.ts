import { students, calculations, emailReports, type Student, type InsertStudent, type Calculation, type InsertCalculation, type EmailReport, type InsertEmailReport } from "@shared/schema";
import { db } from "./db";
import { eq, avg } from "drizzle-orm";

export interface IStorage {
  getStudent(id: number): Promise<Student | undefined>;
  getStudentByEmail(email: string): Promise<Student | undefined>;
  createStudent(insertStudent: InsertStudent): Promise<Student>;
  createCalculation(insertCalculation: InsertCalculation): Promise<Calculation>;
  getCalculation(id: number): Promise<Calculation | undefined>;
  updateCalculationStudent(calculationId: number, studentId: number): Promise<void>;
  createEmailReport(insertEmailReport: InsertEmailReport): Promise<EmailReport>;
  getAverageEmissions(): Promise<number>;
  getAllCalculations(): Promise<Calculation[]>;
}

export class DatabaseStorage implements IStorage {
  async getStudent(id: number): Promise<Student | undefined> {
    const [student] = await db.select().from(students).where(eq(students.id, id));
    return student || undefined;
  }

  async getStudentByEmail(email: string): Promise<Student | undefined> {
    const [student] = await db.select().from(students).where(eq(students.email, email));
    return student || undefined;
  }

  async createStudent(insertStudent: InsertStudent): Promise<Student> {
    const [student] = await db
      .insert(students)
      .values(insertStudent)
      .returning();
    return student;
  }

  async createCalculation(insertCalculation: InsertCalculation): Promise<Calculation> {
    const [calculation] = await db
      .insert(calculations)
      .values(insertCalculation)
      .returning();
    return calculation;
  }

  async getCalculation(id: number): Promise<Calculation | undefined> {
    const [calculation] = await db.select().from(calculations).where(eq(calculations.id, id));
    return calculation || undefined;
  }

  async updateCalculationStudent(calculationId: number, studentId: number): Promise<void> {
    await db
      .update(calculations)
      .set({ studentId })
      .where(eq(calculations.id, calculationId));
  }

  async createEmailReport(insertEmailReport: InsertEmailReport): Promise<EmailReport> {
    const [emailReport] = await db
      .insert(emailReports)
      .values(insertEmailReport)
      .returning();
    return emailReport;
  }

  async getAverageEmissions(): Promise<number> {
    const result = await db
      .select({ average: avg(calculations.dailyEmissions) })
      .from(calculations);
    return Number(result[0]?.average) || 3.2;
  }

  async getAllCalculations(): Promise<Calculation[]> {
    return await db.select().from(calculations);
  }
}

export const storage = new DatabaseStorage();