import { Handler } from '@netlify/functions';
import { z } from 'zod';
import { DatabaseStorage } from '../../server/storage';
import { sendEnvironmentalReport } from '../../server/emailService';

const storage = new DatabaseStorage();

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
    const calculation = await storage.getCalculation(calculationId);
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
    let student = await storage.getStudentByEmail(email);
    if (!student) {
      student = await storage.createStudent({ name, email });
    }

    // Link calculation to student
    await storage.updateCalculationStudent(calculationId, student.id);

    // Get average for comparison
    const averageDaily = await storage.getAverageEmissions();
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
      await storage.createEmailReport({
        studentId: student.id,
        calculationId,
        sentAt: new Date(),
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
  const homeRecommendations = [];
  const schoolRecommendations = [];

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