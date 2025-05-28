import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailData {
  student: { name: string; email: string };
  calculation: {
    dailyEmissions: number;
    weeklyEmissions: number;
    yearlyEmissions: number;
    transportMethod: string;
    hydrationHabit: string;
    packagingHabit: string;
  };
  averageDaily: number;
  comparisonPercentage: number;
  recommendations: {
    home: string[];
    school: string[];
  };
}

export async function sendEnvironmentalReport(emailData: EmailData): Promise<boolean> {
  try {
    const { student, calculation, averageDaily, comparisonPercentage, recommendations } = emailData;
    
    const comparisonText = comparisonPercentage > 0 
      ? `¡Felicidades! Contaminas un ${comparisonPercentage}% menos que la media de estudiantes.`
      : `Tu impacto está ${Math.abs(comparisonPercentage)}% por encima de la media de estudiantes.`;

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2E7D32 0%, #1976D2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px; margin-bottom: 30px; }
            .results { background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; }
            .metric { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #2E7D32; }
            .comparison { background: #e8f5e8; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center; }
            .recommendations { background: #f0f8ff; padding: 20px; border-radius: 10px; margin: 20px 0; }
            .rec-section { margin: 15px 0; }
            .rec-section h4 { color: #2E7D32; margin-bottom: 10px; }
            .rec-list { list-style: none; padding: 0; }
            .rec-list li { background: white; padding: 10px; margin: 5px 0; border-radius: 5px; border-left: 3px solid #2E7D32; }
            .footer { text-align: center; margin-top: 40px; padding: 20px; background: #f8f9fa; border-radius: 10px; font-size: 12px; color: #666; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🌱 Tu Informe Ambiental Personalizado</h1>
            <p>Institut de Química i Biotecnologia de Barcelona</p>
        </div>

        <p>Hola <strong>${student.name}</strong>,</p>
        
        <p>Gracias por usar nuestra Calculadora de Impacto Ambiental. Aquí tienes tu informe personalizado con tus emisiones de CO₂ y recomendaciones para reducir tu huella de carbono.</p>

        <div class="results">
            <h3>📊 Tus Emisiones de CO₂</h3>
            <div class="metric">
                <h4>Emisiones Diarias</h4>
                <p><strong>${calculation.dailyEmissions.toFixed(2)} kg CO₂e/día</strong></p>
            </div>
            <div class="metric">
                <h4>Emisiones Semanales</h4>
                <p><strong>${calculation.weeklyEmissions.toFixed(2)} kg CO₂e/semana</strong></p>
            </div>
            <div class="metric">
                <h4>Emisiones Anuales</h4>
                <p><strong>${Math.round(calculation.yearlyEmissions)} kg CO₂e/año</strong></p>
            </div>
        </div>

        <div class="comparison">
            <h3>📈 Comparación con otros estudiantes</h3>
            <p>Media de estudiantes: <strong>${averageDaily.toFixed(2)} kg CO₂e/día</strong></p>
            <p>Tu impacto: <strong>${calculation.dailyEmissions.toFixed(2)} kg CO₂e/día</strong></p>
            <p style="font-size: 18px; color: ${comparisonPercentage > 0 ? '#2E7D32' : '#d32f2f'};">
                ${comparisonText}
            </p>
        </div>

        <div class="recommendations">
            <h3>💡 Recomendaciones Personalizadas</h3>
            
            <div class="rec-section">
                <h4>🏠 En Casa</h4>
                <ul class="rec-list">
                    ${recommendations.home.map(rec => `<li>• ${rec}</li>`).join('')}
                </ul>
            </div>

            <div class="rec-section">
                <h4>🏫 En el Instituto</h4>
                <ul class="rec-list">
                    ${recommendations.school.map(rec => `<li>• ${rec}</li>`).join('')}
                </ul>
            </div>
        </div>

        <p>¡Cada pequeña acción cuenta para cuidar nuestro planeta! 🌍</p>

        <div class="footer">
            <p><strong>Institut de Química i Biotecnologia de Barcelona</strong></p>
            <p>Calculadora de Impacto Ambiental</p>
            <p>Factores de emisión basados en estándares oficiales (Defra 2007 & EEA 2018)</p>
        </div>
    </body>
    </html>
    `;

    const { data, error } = await resend.emails.send({
      from: 'Calculadora Ambiental <calculadora@resend.dev>',
      to: [student.email],
      subject: `🌱 Tu Informe Ambiental - ${student.name}`,
      html: htmlContent,
    });

    if (error) {
      console.error('Error sending email:', error);
      return false;
    }

    console.log('Email sent successfully:', data);
    return true;
  } catch (error) {
    console.error('Error in email service:', error);
    return false;
  }
}