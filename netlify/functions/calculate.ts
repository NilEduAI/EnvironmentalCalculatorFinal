import { Handler } from '@netlify/functions';
import { z } from 'zod';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "../../shared/schema";
import { EMISSION_FACTORS, HYDRATION_FACTORS, PACKAGING_FACTORS, calculations } from '../../shared/schema';

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema });

export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    console.log("Received data:", body);
    
    const calculateSchema = z.object({
      distance: z.number().min(0),
      transportMethod: z.enum(Object.keys(EMISSION_FACTORS) as [keyof typeof EMISSION_FACTORS]),
      hydrationHabit: z.enum(Object.keys(HYDRATION_FACTORS) as [keyof typeof HYDRATION_FACTORS]),
      packagingHabit: z.enum(Object.keys(PACKAGING_FACTORS) as [keyof typeof PACKAGING_FACTORS]),
    });

    const data = calculateSchema.parse(body);
    console.log("Parsed data:", data);
    
    // Calculate emissions
    const transportEmission = EMISSION_FACTORS[data.transportMethod] * data.distance * 2; // round trip
    const hydrationEmission = HYDRATION_FACTORS[data.hydrationHabit];
    const packagingEmission = PACKAGING_FACTORS[data.packagingHabit];
    
    const dailyEmissions = transportEmission + hydrationEmission + packagingEmission;
    const weeklyEmissions = dailyEmissions * 5; // school days
    const yearlyEmissions = weeklyEmissions * 36; // school weeks

    const calculationData = {
      studentId: null,
      distance: data.distance,
      transportMethod: data.transportMethod,
      hydrationHabit: data.hydrationHabit,
      packagingHabit: data.packagingHabit,
      dailyEmissions,
      weeklyEmissions,
      yearlyEmissions,
    };

    const [savedCalculation] = await db
      .insert(calculations)
      .values(calculationData)
      .returning();
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        calculationId: savedCalculation.id,
        dailyEmissions,
        weeklyEmissions,
        yearlyEmissions,
      }),
    };
  } catch (error) {
    console.error("Calculation error:", error);
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        message: "Invalid calculation data", 
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};