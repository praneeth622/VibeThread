import { Controller, Get, Post, Body, Res, Options, HttpCode, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Response } from 'express';
import { AudioService } from './audio.service';

@ApiTags('audio')
@Controller('/api/audio')
export class AudioController {
    constructor(private readonly audioService: AudioService) {}

    @Get('/')
    @ApiOperation({ summary: 'Check if Audio API is working' })
    @ApiResponse({ status: 200, description: 'API is working' })
    getAudio() {
        return {
            message: 'Audio API is working'
        }
    }

    @Get('health')
    @ApiOperation({ summary: 'Health check for Audio API' })
    @ApiResponse({ status: 200, description: 'API is healthy' })
    getHealth() {
        return {
            message: 'Audio API is Healthy'
        }
    }

    // Add OPTIONS handler for preflight requests
    @Options('extract-audio')
    @HttpCode(204)
    preflightExtractAudio() {
        return;
    }

    @Post('extract-audio')
    @ApiOperation({ summary: 'Extract audio from Instagram URL' })
    @ApiBody({ 
        description: 'Instagram URL to extract audio from',
        schema: {
            type: 'object',
            properties: {
                url: {
                    type: 'string',
                    description: 'Instagram post URL',
                    example: 'https://www.instagram.com/p/example/'
                }
            },
            required: ['url']
        }
    })
    @ApiResponse({ status: 200, description: 'Audio extracted successfully' })
    @ApiResponse({ status: 500, description: 'Error extracting audio' })
    async extractAudio(@Body() body: { url: string }, @Res() res: Response) {
        const { url } = body;
        console.log('URL:', url);

        try {
            const audio = await this.audioService.downloadInstagramAudioAsMP3(body.url)
            return res.status(200).json({
                message: 'Audio extracted successfully',
                audio
            });
        } catch (error) {
            return res.status(500).json({
                message: 'Error extracting audio',
                error: error.message
            });
        }
    }

    // Spotify OAuth endpoints
    @Options('spotify/auth')
    @HttpCode(204)
    preflightSpotifyAuth() {
        return;
    }

    @Post('spotify/auth')
    @ApiOperation({ summary: 'Generate Spotify OAuth authorization URL' })
    @ApiResponse({ status: 200, description: 'Authorization URL generated successfully' })
    @ApiResponse({ status: 500, description: 'Error generating authorization URL' })
    async generateSpotifyAuthUrl(@Res() res: Response) {
        console.log('Generating Spotify auth URL');
        try {
            const authUrl = await this.audioService.generateSpotifyAuthUrl();
            return res.status(200).json({
                authUrl
            });
        } catch (error) {
            return res.status(500).json({
                message: 'Error generating Spotify auth URL',
                error: error.message
            });
        }
    }

    @Options('spotify/callback')
    @HttpCode(204)
    preflightSpotifyCallback() {
        return;
    }

    @Post('spotify/callback')
    @ApiOperation({ summary: 'Handle Spotify OAuth callback' })
    @ApiBody({ 
        description: 'Authorization code from Spotify',
        schema: {
            type: 'object',
            properties: {
                code: {
                    type: 'string',
                    description: 'Authorization code from Spotify OAuth callback'
                }
            },
            required: ['code']
        }
    })
    @ApiResponse({ status: 200, description: 'Authorization successful, tokens returned' })
    @ApiResponse({ status: 500, description: 'Error handling callback' })
    async handleSpotifyCallback(@Body() body: { code: string }, @Res() res: Response) {
        try {
            const tokens = await this.audioService.exchangeSpotifyCode(body.code);
            return res.status(200).json({
                message: 'Spotify authorization successful',
                tokens
            });
        } catch (error) {
            return res.status(500).json({
                message: 'Error handling Spotify callback',
                error: error.message
            });
        }
    }

    @Options('spotify/create-playlist')
    @HttpCode(204)
    preflightCreatePlaylist() {
        return;
    }

    @Post('spotify/create-playlist')
    @ApiOperation({ summary: 'Create a Spotify playlist with selected tracks' })
    @ApiBody({ 
        description: 'Playlist creation data',
        schema: {
            type: 'object',
            properties: {
                accessToken: {
                    type: 'string',
                    description: 'Spotify access token'
                },
                playlistName: {
                    type: 'string',
                    description: 'Name of the playlist'
                },
                playlistDescription: {
                    type: 'string',
                    description: 'Description of the playlist (optional)'
                },
                isPublic: {
                    type: 'boolean',
                    description: 'Whether the playlist should be public (optional, default: false)'
                },
                selectedTracks: {
                    type: 'array',
                    description: 'Array of tracks to add to the playlist',
                    items: {
                        type: 'object',
                        properties: {
                            spotifyId: { type: 'string' },
                            title: { type: 'string' },
                            artists: { type: 'string' }
                        }
                    }
                }
            },
            required: ['accessToken', 'playlistName', 'selectedTracks']
        }
    })
    @ApiResponse({ status: 200, description: 'Playlist created successfully' })
    @ApiResponse({ status: 500, description: 'Error creating playlist' })
    async createSpotifyPlaylist(
        @Body() body: { 
            accessToken: string;
            playlistName: string;
            playlistDescription?: string;
            isPublic?: boolean;
            selectedTracks: Array<{
                spotifyId: string;
                title: string;
                artists: string;
            }>;
        }, 
        @Res() res: Response
    ) {
        try {
            const playlist = await this.audioService.createSpotifyPlaylist(
                body.accessToken,
                body.playlistName,
                body.playlistDescription,
                body.isPublic,
                body.selectedTracks
            );
            return res.status(200).json({
                message: 'Playlist created successfully',
                playlist
            });
        } catch (error) {
            return res.status(500).json({
                message: 'Error creating Spotify playlist',
                error: error.message
            });
        }
    }
}