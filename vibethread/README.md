# VibeThread Backend API

A NestJS-based REST API for extracting and identifying music from Instagram videos and other media sources using ACRCloud's music recognition service.

## Overview

VibeThread Backend is a robust web service that:
- Downloads audio from Instagram videos and other supported platforms using yt-dlp
- Converts media to MP3 format using ffmpeg
- Identifies music using ACRCloud's audio fingerprinting API
- Returns structured music metadata including Spotify and YouTube links
- Automatically cleans up temporary files

## Features

- 🎵 Extract audio from Instagram, YouTube, TikTok, and 1000+ other platforms
- 🔄 Convert media to MP3 format with high quality
- 🎯 Identify music using ACRCloud's advanced audio recognition
- 📊 Return detailed metadata (title, artist, album, Spotify/YouTube links)
- 🧹 Automatic cleanup of temporary files
- 🚀 Fast and efficient processing
- 🔒 CORS-enabled for frontend integration

## Prerequisites

### System Dependencies
- **Node.js** (v20.x or later)
- **npm** (v10.x or later)
- **ffmpeg** - Required for audio extraction and conversion
- **yt-dlp** - Required for downloading media from various platforms
- **Python 3** - Required for yt-dlp

### Installing System Dependencies

#### Ubuntu/Debian
```bash
# Update package list
sudo apt update

# Install ffmpeg
sudo apt install ffmpeg

# Install Python 3 and pip
sudo apt install python3 python3-pip

# Install yt-dlp
pip3 install yt-dlp

# Verify installations
ffmpeg -version
yt-dlp --version
```

#### macOS (with Homebrew)
```bash
# Install ffmpeg
brew install ffmpeg

# Install Python 3
brew install python3

# Install yt-dlp
pip3 install yt-dlp
```

#### Windows (with Chocolatey)
```bash
# Install ffmpeg
choco install ffmpeg

# Install Python 3
choco install python3

# Install yt-dlp
pip install yt-dlp
```

## Installation

1. **Clone the repository:**
```bash
git clone <your-repo-url>
cd vibethread
```

2. **Install Node.js dependencies:**
```bash
npm install
```

3. **Create environment file:**
```bash
cp .env.example .env
```

4. **Configure environment variables in `.env`:**
```env
# ACRCloud Configuration (Required)
ACR_ACCESS_KEY=your_acrcloud_access_key
ACR_ACCESS_SECRET=your_acrcloud_access_secret
ACR_HOST=identify-ap-southeast-1.acrcloud.com

# Server Configuration
PORT=3000
NODE_ENV=development

# Optional: Spotify Integration
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

## Getting ACRCloud Credentials

1. Visit [ACRCloud Console](https://console.acrcloud.com/)
2. Sign up for a free account
3. Create a new project
4. Choose "Audio & Video Recognition"
5. Copy your Access Key and Access Secret

## Running the Application

### Development Mode
```bash
npm run start:dev
```

### Production Mode
```bash
# Build the application
npm run build

# Start production server
npm run start:prod
```

The API will be available at `https://vibethread-backend.praneethd.xyz`

## API Endpoints

### Health Check
```http
GET /api/audio/health
```

**Response:**
```json
{
  "message": "Audio API is Healthy"
}
```

### Extract and Identify Audio
```http
POST /api/audio/extract-audio
Content-Type: application/json

{
  "url": "https://www.instagram.com/reel/your-reel-id/"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "title": "Song Title",
    "artists": [{"name": "Artist Name"}],
    "album": {"name": "Album Name"},
    "release_date": "2023-01-01",
    "duration_ms": 180000,
    "external_urls": {
      "spotify": "https://open.spotify.com/track/...",
      "youtube": "https://www.youtube.com/watch?v=..."
    },
    "genres": ["pop", "electronic"],
    "label": "Record Label"
  }
}
```

## Project Structure

```
vibethread/
├── src/
│   ├── audio/
│   │   ├── audio.controller.ts    # API endpoints
│   │   ├── audio.service.ts       # Core business logic
│   │   ├── audio.module.ts        # Module definition
│   │   └── cookies.txt            # yt-dlp cookies (optional)
│   ├── app.controller.ts          # Root controller
│   ├── app.module.ts              # Root module
│   ├── app.service.ts             # Root service
│   └── main.ts                    # Application entry point
├── public/
│   └── audio/
│       └── downloads/             # Temporary audio files
├── dist/                          # Compiled JavaScript
├── test/                          # Test files
├── .env                           # Environment variables
├── .env.example                   # Environment template
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
├── nest-cli.json                  # NestJS CLI config
├── Dockerfile                     # Docker configuration
└── README.md                      # This file
```

## Development

### Available Scripts
```bash
# Development with hot reload
npm run start:dev

# Build for production
npm run build

# Run tests
npm run test

# Run e2e tests
npm run test:e2e

# Lint code
npm run lint

# Format code
npm run format
```

### Testing
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Docker Support

Build and run with Docker:

```bash
# Build Docker image
docker build -t vibethread-backend .

# Run container
docker run -p 3000:3000 --env-file .env vibethread-backend
```

## Troubleshooting

### Common Issues

1. **yt-dlp not found**
   - Ensure Python 3 is installed
   - Install yt-dlp: `pip3 install yt-dlp`
   - Add to PATH if necessary

2. **ffmpeg not found**
   - Install ffmpeg using your system package manager
   - Verify with: `ffmpeg -version`

3. **Permission errors**
   - Ensure write permissions for `public/audio/downloads/`
   - Create directory manually: `mkdir -p public/audio/downloads`

4. **ACRCloud errors**
   - Verify your credentials in `.env`
   - Check your ACRCloud quota
   - Ensure correct region endpoint

### Logs
Check application logs for detailed error information:
```bash
# Development logs
npm run start:dev

# Production logs with PM2
pm2 logs vibethread
```

## Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=3000
ACR_ACCESS_KEY=your_production_key
ACR_ACCESS_SECRET=your_production_secret
ACR_HOST=identify-ap-southeast-1.acrcloud.com
```

### PM2 Process Manager
```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start dist/main.js --name vibethread

# Monitor
pm2 monit

# Restart
pm2 restart vibethread
```

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review application logs
3. Verify system dependencies
4. Check ACRCloud service status
