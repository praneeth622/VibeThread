# VibeThread

A NestJS application for extracting and identifying music from Instagram videos and other media sources.

## Overview

VibeThread is a web service that allows users to extract audio from Instagram videos and identify the songs using ACRCloud's music recognition API. The application downloads the audio track from a provided URL, converts it to MP3 format, and then uses audio fingerprinting to identify the song, returning detailed information including:

- Song title and artists
- Album information
- Spotify track links
- YouTube video links
- Genre information
- Duration and other metadata

## Features

- Extract audio from Instagram videos and other supported platforms
- Convert media to MP3 format
- Identify music using ACRCloud's audio recognition API
- Return structured music metadata including Spotify and YouTube links
- Clean up temporary files automatically

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v20.x or later recommended)
- npm (v10.x or later)
- ffmpeg - Required for audio extraction
- yt-dlp - Required for downloading media from various platforms

### Installing Dependencies

```bash
# Install ffmpeg
# On Ubuntu/Debian
sudo apt update
sudo apt install ffmpeg

# On macOS with Homebrew
brew install ffmpeg

# On Windows with Chocolatey
choco install ffmpeg

# Install yt-dlp
pip install yt-dlp
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/vibethread.git
cd vibethread
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your ACRCloud credentials:
```
ACR_ACCESS_KEY=your_access_key
ACR_ACCESS_SECRET=your_access_secret
ACR_HOST=identify-ap-southeast-1.acrcloud.com
PORT=3000
```

## Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

The application will be available at `https://vibethread-backend.praneethd.xyz` (or the port specified in your .env file).

## API Endpoints

### Extract Audio from URL
```
POST /api/audio/extract-audio
```

Request body:
```json
{
  "url": "https://www.instagram.com/reel/example"
}
```

Response:
```json
{
  "message": "Audio extracted successfully",
  "audio": {
    "success": true,
    "output": "Command output...",
    "musicData": [
      {
        "filePath": "path/to/processed/file.mp3",
        "musicInfo": [
          {
            "title": "Song Title",
            "artists": ["Artist Name"],
            "album": "Album Name",
            "duration_ms": 300000,
            "score": 100,
            "release_date": "2023-01-01",
            "spotify": {
              "track": {
                "name": "Song Title",
                "id": "spotify_track_id"
              },
              "album": {
                "name": "Album Name",
                "id": "spotify_album_id"
              },
              "artists": [
                {
                  "name": "Artist Name",
                  "id": "spotify_artist_id"
                }
              ]
            },
            "youtube": {
              "vid": "youtube_video_id"
            },
            "genres": ["Pop", "Rock"]
          }
        ]
      }
    ]
  }
}
```

### Health Check
```
GET /api/audio/health
```

Response:
```json
{
  "message": "Audio API is Healthy"
}
```

## How It Works

1. The application receives a URL to a video (Instagram, YouTube, etc.)
2. It uses yt-dlp to download the media and extract the audio as MP3
3. The MP3 file is sent to ACRCloud's API for music identification
4. The application processes the response and extracts relevant music information
5. Temporary files are deleted after processing
6. Structured music data is returned to the client

## Project Structure

```
vibethread/
├── src/
│   ├── audio/
│   │   ├── audio.controller.ts  # API endpoints for audio processing
│   │   ├── audio.module.ts      # Audio module definition
│   │   └── audio.service.ts     # Core audio processing logic
│   ├── app.controller.ts        # Main app controller
│   ├── app.module.ts            # Main app module
│   ├── app.service.ts           # Main app service
│   └── main.ts                  # Application entry point
├── public/
│   └── audio/
│       └── downloads/           # Temporary directory for downloaded audio
├── test/                        # Test files
├── .env                         # Environment variables
├── .gitignore                   # Git ignore file
├── nest-cli.json                # NestJS CLI configuration
├── package.json                 # Project dependencies
├── tsconfig.json                # TypeScript configuration
└── README.md                    # Project documentation
```

## Development

### Running Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Linting and Formatting

```bash
# Lint code
npm run lint

# Format code
npm run format
```

## Deployment

This application can be deployed to any Node.js hosting platform. Make sure to set up the required environment variables and install the system dependencies (ffmpeg and yt-dlp) on your server.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [NestJS](https://nestjs.com/) - The framework used
- [ACRCloud](https://www.acrcloud.com/) - Music recognition API
- [yt-dlp](https://github.com/yt-dlp/yt-dlp) - Media downloader
- [ffmpeg](https://ffmpeg.org/) - Audio processing
