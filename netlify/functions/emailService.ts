import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

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
    
    // Determine if emissions are above or below average
    const comparisonText = comparisonPercentage > 0 
      ? `${comparisonPercentage.toFixed(1)}% por encima del promedio`
      : `${Math.abs(comparisonPercentage).toFixed(1)}% por debajo del promedio`;

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Tu Informe de Impacto Ambiental</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .metric-box { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .comparison { background: #e0f2fe; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .recommendations { background: #f1f8e9; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            h1, h2, h3 { margin-top: 0; }
            .highlight { color: #059669; font-weight: bold; }
            ul { padding-left: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🌍 Tu Informe de Impacto Ambiental</h1>
                <p>Hola ${student.name},</p>
                <p>Aquí tienes tu análisis personalizado de huella de carbono</p>
            </div>
            
            <div class="content">
                <div class="metric-box">
                    <h2>📊 Tus Emisiones de CO₂</h2>
                    <p><strong>Diarias:</strong> <span class="highlight">${calculation.dailyEmissions.toFixed(2)} kg CO₂e</span></p>
                    <p><strong>Semanales:</strong> <span class="highlight">${calculation.weeklyEmissions.toFixed(2)} kg CO₂e</span></p>
                    <p><strong>Anuales:</strong> <span class="highlight">${calculation.yearlyEmissions.toFixed(2)} kg CO₂e</span></p>
                </div>

                <div class="comparison">
                    <h3>📈 Comparación con otros estudiantes</h3>
                    <p>Tu impacto diario es <strong>${comparisonText}</strong></p>
                    <p>Promedio general: ${averageDaily.toFixed(2)} kg CO₂e/día</p>
                </div>

                <div class="metric-box">
                    <h3>🚀 Tus Hábitos</h3>
                    <p><strong>Transporte:</strong> ${getTransportLabel(calculation.transportMethod)}</p>
                    <p><strong>Hidratación:</strong> ${getHydrationLabel(calculation.hydrationHabit)}</p>
                    <p><strong>Envases:</strong> ${getPackagingLabel(calculation.packagingHabit)}</p>
                </div>

                ${recommendations.home.length > 0 ? `
                <div class="recommendations">
                    <h3>🏠 Recomendaciones para casa</h3>
                    <ul>
                        ${recommendations.home.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}

                ${recommendations.school.length > 0 ? `
                <div class="recommendations">
                    <h3>🏫 Recomendaciones para el instituto</h3>
                    <ul>
                        ${recommendations.school.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}

                <div class="footer">
                    <p>💚 Cada pequeña acción cuenta para cuidar nuestro planeta</p>
                    <p><em>Institut de Química i Biotecnologia de Barcelona</em></p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: student.email,
      subject: '🌍 Tu Informe de Impacto Ambiental - IQBB',
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    console.log('Email report sent successfully to', student.email);
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

function getTransportLabel(method: string): string {
  const labels = {
    'walking': 'Caminando',
    'bicycle': 'Bicicleta',
    'public-transport': 'Transporte público',
    'motorbike': 'Motocicleta',
    'private-car': 'Coche privado'
  };
  return labels[method as keyof typeof labels] || method;
}

function getHydrationLabel(habit: string): string {
  const labels = {
    'tap-water': 'Agua del grifo',
    'steel-bottle': 'Botella de acero',
    'plastic-bottle': 'Botella de plástico',
    'beverages': 'Bebidas'
  };
  return labels[habit as keyof typeof labels] || habit;
}

function getPackagingLabel(habit: string): string {
  const labels = {
    'no-packaging': 'Sin envases',
    'reusable-containers': 'Recipientes reutilizables',
    'aluminum-foil': 'Papel de aluminio',
    'plastic-bottles': 'Botellas de plástico'
  };
  return labels[habit as keyof typeof labels] || habit;
}