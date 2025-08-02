import { AudioResult } from './types';

const API_BASE_URL = 'http://localhost:3000/api/audio';

export async function extractAudio(url: string): Promise<any> {
  try {
    // Make the actual API call to our backend
    const response = await fetch(`${API_BASE_URL}/extract-audio`, {
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

// Spotify API functions
export async function generateSpotifyAuthUrl(): Promise<string> {
  try {
    console.log('Calling generateSpotifyAuthUrl API...');
    const response = await fetch(`${API_BASE_URL}/spotify/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API error response:', errorData);
      throw new Error(errorData.message || 'Failed to generate Spotify auth URL');
    }

    const data = await response.json();
    console.log('Auth URL generated:', data.authUrl);
    return data.authUrl;
  } catch (error) {
    console.error('Error generating Spotify auth URL:', error);
    throw error;
  }
}

export async function exchangeSpotifyCode(code: string): Promise<any> {
  try {
    console.log('Exchanging Spotify code:', code);
    const response = await fetch(`${API_BASE_URL}/spotify/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    console.log('Exchange code response status:', response.status);
    console.log('Exchange code response ok:', response.ok);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Exchange code API error response:', errorData);
      throw new Error(errorData.message || 'Failed to exchange Spotify code');
    }

    const data = await response.json();
    console.log('Tokens received:', data.tokens);
    return data.tokens;
  } catch (error) {
    console.error('Error exchanging Spotify code:', error);
    throw error;
  }
}

export async function createSpotifyPlaylist(
  accessToken: string,
  playlistName: string,
  playlistDescription: string,
  isPublic: boolean,
  selectedTracks: Array<{
    spotifyId: string;
    title: string;
    artists: string;
  }>
): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/spotify/create-playlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accessToken,
        playlistName,
        playlistDescription,
        isPublic,
        selectedTracks,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create Spotify playlist');
    }

    const data = await response.json();
    return data.playlist;
  } catch (error) {
    console.error('Error creating Spotify playlist:', error);
    throw error;
  }
}
