import { AudioResult } from './types';

export async function extractAudio(url: string): Promise<any> {
  try {
    // Make the actual API call to our backend
    const response = await fetch('http://localhost:3001/api/audio/extract-audio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to extract audio');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error extracting audio:', error);
    throw error;
  }
}
