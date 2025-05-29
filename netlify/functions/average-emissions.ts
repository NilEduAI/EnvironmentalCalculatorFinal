import { Handler } from '@netlify/functions';
import { DatabaseStorage } from '../../server/storage';

const storage = new DatabaseStorage();

export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  }

  try {
    const averageDaily = await storage.getAverageEmissions();
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ averageDaily }),
    };
  } catch (error) {
    console.error("Average emissions error:", error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ message: 'Failed to get average emissions' }),
    };
  }
};