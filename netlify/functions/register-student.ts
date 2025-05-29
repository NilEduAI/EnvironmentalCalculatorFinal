import { Handler } from '@netlify/functions';
import { z } from 'zod';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { eq, sql } from 'drizzle-orm';
import ws from "ws";
import * as schema from "../../shared/schema";
import { students, calculations, emailReports } from '../../shared/schema';
import { sendEnvironmentalReport } from '../../server/emailService';

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
    
    const schema = z.object({
      name: z.string().min(1),
      email: z.string().email(),
      calculationId: z.number(),
    });

    const { name, email, calculationId } = schema.parse(body);
    
    // Get calculation data
    const [calculation] = await db
      .select()
      .from(calculations)
      .where(eq(calculations.id, calculationId));
      
    if (!calculation) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ message: 'Calculation not found' }),
      };
    }

    // Check if student already exists
    let [student] = await db
      .select()
      .from(students)
      .where(eq(students.email, email));
      
    if (!student) {
      [student] = await db
        .insert(students)
        .values({ name, email })
        .returning();
    }

    // Link calculation to student
    await db
      .update(calculations)
      .set({ studentId: student.id })
      .where(eq(calculations.id, calculationId));

    // Get average for comparison
    const result = await db
      .select({ avg: sql<number>`AVG(${calculations.dailyEmissions})` })
      .from(calculations);
      
    const averageDaily = result[0]?.avg || 3.2;
    const comparisonPercentage = ((calculation.dailyEmissions - averageDaily) / averageDaily) * 100;

    // Generate recommendations based on calculation
    const recommendations = generateRecommendations(calculation);

    // Send email report
    const emailData = {
      student: { name: student.name, email: student.email },
      calculation: {
        dailyEmissions: calculation.dailyEmissions,
        weeklyEmissions: calculation.weeklyEmissions,
        yearlyEmissions: calculation.yearlyEmissions,
        transportMethod: calculation.transportMethod,
        hydrationHabit: calculation.hydrationHabit,
        packagingHabit: calculation.packagingHabit,
      },
      averageDaily,
      comparisonPercentage,
      recommendations,
    };

    const emailSent = await sendEnvironmentalReport(emailData);
    
    if (emailSent) {
      await db
        .insert(emailReports)
        .values({
          studentId: student.id,
          calculationId: calculationId,
          reportData: emailData,
        });
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: emailSent ? 'Student registered and email sent successfully' : 'Student registered but email failed',
        emailSent,
      }),
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        message: 'Registration failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};

function generateRecommendations(calculation: any) {
  const homeRecommendations: string[] = [];
  const schoolRecommendations: string[] = [];

  // Transport recommendations
  if (calculation.transportMethod === 'private-car') {
    homeRecommendations.push('Considera usar transporte público o compartir coche');
    schoolRecommendations.push('Organiza grupos para compartir transporte al instituto');
  } else if (calculation.transportMethod === 'public-transport') {
    homeRecommendations.push('¡Excelente elección de transporte sostenible!');
  }

  // Hydration recommendations
  if (calculation.hydrationHabit === 'plastic-bottle') {
    homeRecommendations.push('Usa una botella reutilizable en lugar de botellas de plástico');
    schoolRecommendations.push('Instala fuentes de agua para rellenar botellas reutilizables');
  }

  // Packaging recommendations  
  if (calculation.packagingHabit === 'aluminum-foil') {
    homeRecommendations.push('Usa recipientes reutilizables para el almuerzo');
    schoolRecommendations.push('Promueve el uso de envases reutilizables en el comedor');
  }

  return { home: homeRecommendations, school: schoolRecommendations };
}