import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertStudentSchema, insertCalculationSchema, EMISSION_FACTORS, HYDRATION_FACTORS, PACKAGING_FACTORS } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get average emissions for comparison
  app.get("/api/average-emissions", async (req, res) => {
    try {
      const average = await storage.getAverageEmissions();
      res.json({ averageDaily: average });
    } catch (error) {
      res.status(500).json({ message: "Error calculating average emissions" });
    }
  });

  // Calculate emissions
  app.post("/api/calculate", async (req, res) => {
    try {
      const calculateSchema = z.object({
        distance: z.number().min(0),
        transportMethod: z.enum(Object.keys(EMISSION_FACTORS) as [keyof typeof EMISSION_FACTORS]),
        hydrationHabit: z.enum(Object.keys(HYDRATION_FACTORS) as [keyof typeof HYDRATION_FACTORS]),
        packagingHabit: z.enum(Object.keys(PACKAGING_FACTORS) as [keyof typeof PACKAGING_FACTORS]),
      });

      const data = calculateSchema.parse(req.body);
      
      // Calculate emissions
      const transportEmission = EMISSION_FACTORS[data.transportMethod] * data.distance * 2; // round trip
      const hydrationEmission = HYDRATION_FACTORS[data.hydrationHabit];
      const packagingEmission = PACKAGING_FACTORS[data.packagingHabit];
      
      const dailyEmissions = transportEmission + hydrationEmission + packagingEmission;
      const weeklyEmissions = dailyEmissions * 5; // school days
      const yearlyEmissions = weeklyEmissions * 36; // school weeks

      const calculation = {
        studentId: null,
        ...data,
        dailyEmissions,
        weeklyEmissions,
        yearlyEmissions,
      };

      const savedCalculation = await storage.createCalculation(calculation);
      
      res.json({
        calculationId: savedCalculation.id,
        dailyEmissions,
        weeklyEmissions,
        yearlyEmissions,
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid calculation data" });
    }
  });

  // Register student and send email report
  app.post("/api/register-student", async (req, res) => {
    try {
      const registerSchema = insertStudentSchema.extend({
        calculationId: z.number(),
      });

      const data = registerSchema.parse(req.body);
      
      // Create student
      const student = await storage.createStudent({
        name: data.name,
        email: data.email,
      });

      // Update calculation with student ID
      await storage.updateCalculationStudent(data.calculationId, student.id);

      // Get calculation details for email
      const calculation = await storage.getCalculation(data.calculationId);
      if (!calculation) {
        return res.status(404).json({ message: "Calculation not found" });
      }

      // Get average for comparison
      const averageDaily = await storage.getAverageEmissions();
      
      // Create email report data
      const reportData = {
        student: student,
        calculation: calculation,
        averageDaily: averageDaily,
        comparisonPercentage: Math.round(((averageDaily - calculation.dailyEmissions) / averageDaily) * 100),
        recommendations: generateRecommendations(calculation),
      };

      // Save email report
      await storage.createEmailReport({
        studentId: student.id,
        calculationId: calculation.id,
        reportData: reportData,
      });

      // Send email report using Resend
      const { sendEnvironmentalReport } = await import('./emailService');
      const emailSent = await sendEnvironmentalReport(reportData);
      
      if (emailSent) {
        console.log(`Email report sent successfully to ${student.email}`);
      } else {
        console.error(`Failed to send email report to ${student.email}`);
      }

      res.json({ 
        message: "Student registered and email sent successfully",
        student: student,
        reportData: reportData,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(400).json({ message: "Error registering student" });
    }
  });

  // Get all calculations for analytics
  app.get("/api/calculations", async (req, res) => {
    try {
      const calculations = await storage.getAllCalculations();
      res.json(calculations);
    } catch (error) {
      res.status(500).json({ message: "Error fetching calculations" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function generateRecommendations(calculation: any) {
  const recommendations = {
    home: [
      "Usa LED de bajo consumo energético",
      "Desenchufa dispositivos cuando no los uses",
      "Optimiza la calefacción (18-20°C)",
      "Aprovecha la luz natural durante el día",
    ],
    school: [
      "Usa transporte compartido cuando sea posible",
      "Lleva botella reutilizable",
      "Recicla papel y plástico correctamente",
      "Participa en iniciativas verdes del instituto",
    ],
  };

  // Add specific recommendations based on habits
  if (calculation.transportMethod === 'car-solo') {
    recommendations.school.unshift("Considera compartir coche o usar transporte público");
  }
  
  if (calculation.hydrationHabit === 'plastic-bottle') {
    recommendations.school.unshift("Cambia a una botella reutilizable para reducir residuos");
  }
  
  if (calculation.packagingHabit === 'aluminum-foil') {
    recommendations.school.unshift("Usa envoltorio reutilizable para tu bocadillo");
  }

  return recommendations;
}
