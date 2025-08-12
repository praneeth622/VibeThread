# Spotify Playlist Creation Setup

This guide will help you set up the Spotify playlist creation feature for VibeThread.

## Prerequisites

1. A Spotify Developer account
2. A registered Spotify application

## Setup Instructions

### 1. Create a Spotify Application

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click "Create an App"
4. Fill in the app details:
   - **App name**: VibeThread (or your preferred name)
   - **App description**: Audio extraction and playlist creation tool
   - **Website**: Your website URL (optional)
   - **Redirect URI**: `http://localhost:3001/spotify-callback`
5. Accept the terms and create the app

### 2. Get Your Credentials

1. In your app dashboard, you'll see:
   - **Client ID**: Copy this value
   - **Client Secret**: Click "Show Client Secret" and copy this value

### 3. Configure Environment Variables

1. Open `/vibethread/.env` file
2. Replace the placeholder values:
   ```env
   SPOTIFY_CLIENT_ID=your_actual_client_id_here
   SPOTIFY_CLIENT_SECRET=your_actual_client_secret_here
   ```

### 4. Set Redirect URI

Make sure your Spotify app has the correct redirect URI configured:
- **Redirect URI**: `http://localhost:3001/spotify-callback`

This should match the frontend URL where the callback page is hosted.

## How It Works

1. **User Selection**: Users can select multiple tracks from the extraction results using checkboxes
2. **Playlist Configuration**: Users can configure playlist name, description, and privacy settings
3. **OAuth Flow**: The app opens Spotify's authorization page in a new window
4. **Token Exchange**: After user authorization, the app exchanges the code for access tokens
5. **Playlist Creation**: The app creates a playlist and adds the selected tracks
6. **Success Feedback**: Users receive a success message with a link to their new playlist

## Features

- ✅ Multiple track selection with checkboxes
- ✅ Playlist name and description configuration
- ✅ Public/Private playlist toggle
- ✅ OAuth flow with popup window
- ✅ Automatic track addition to playlist
- ✅ Success/error feedback with toast notifications
- ✅ Direct link to created playlist

## API Endpoints

The following endpoints have been added to the backend:

- `POST /api/audio/spotify/auth` - Generate Spotify OAuth URL
- `POST /api/audio/spotify/callback` - Handle OAuth callback and exchange code for tokens
- `POST /api/audio/spotify/create-playlist` - Create playlist with selected tracks

## Error Handling

The implementation includes comprehensive error handling for:
- Missing Spotify credentials
- OAuth authorization failures
- Network errors during API calls
- Tracks without Spotify IDs
- Popup blocking by browsers

## Security Notes

- Client credentials are stored securely in environment variables
- OAuth flow uses state parameter for CSRF protection
- Access tokens are not stored permanently
- All API calls use HTTPS when in production

## Troubleshooting

### Common Issues

1. **"Failed to open authorization window"**
   - Ensure popups are allowed for your domain
   - Check if browser is blocking popup windows

2. **"Spotify credentials not configured"**
   - Verify SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET are set in .env
   - Restart the backend server after updating .env

3. **"None of the selected tracks have Spotify IDs"**
   - This happens when ACRCloud doesn't return Spotify metadata
   - Only tracks with valid Spotify IDs can be added to playlists

4. **OAuth redirect issues**
   - Ensure the redirect URI in Spotify app settings matches exactly: `http://localhost:3001/spotify-callback`
   - Check that the frontend is running on port 3001

### Development vs Production

For production deployment, update:
- Redirect URI to your production domain
- Frontend callback URL in the audio service
- Environment variables on your hosting platform