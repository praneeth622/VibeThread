"use client";

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function SpotifyCallback() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    console.log('Spotify callback received:', { code, error });
    console.log('Window opener exists:', !!window.opener);
    console.log('Current origin:', window.location.origin);

    if (window.opener) {
      if (code) {
        console.log('Sending SPOTIFY_AUTH_SUCCESS message with code:', code);
        // Send the authorization code back to the parent window
        window.opener.postMessage({
          type: 'SPOTIFY_AUTH_SUCCESS',
          code: code
        }, '*'); // Use '*' to allow any origin for debugging
      } else if (error) {
        console.log('Sending SPOTIFY_AUTH_ERROR message with error:', error);
        // Send error back to the parent window
        window.opener.postMessage({
          type: 'SPOTIFY_AUTH_ERROR',
          error: error
        }, '*'); // Use '*' to allow any origin for debugging
      } else {
        console.log('No code or error found in URL parameters');
      }
      
      // Delay closing to allow message to be sent
      setTimeout(() => {
        console.log('Closing popup window');
        window.close();
      }, 1000);
    } else {
      console.log('No window.opener found - this might not be a popup');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
        <p className="text-white">Processing Spotify authorization...</p>
        <p className="text-gray-400 text-sm mt-2">This window will close automatically.</p>
        <div className="mt-4 text-xs text-gray-500">
          <p>Code: {searchParams.get('code') ? 'Present' : 'Not found'}</p>
          <p>Error: {searchParams.get('error') || 'None'}</p>
          <p>Opener: {typeof window !== 'undefined' && window.opener ? 'Present' : 'Not found'}</p>
        </div>
      </div>
    </div>
  );
}