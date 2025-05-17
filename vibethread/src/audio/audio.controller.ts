import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AudioService } from './audio.service';

@Controller('/api/audio')
export class AudioController {
    constructor(private readonly audioService: AudioService) {}

    @Get('/')
    getAudio() {
        return {
            message: 'Audio API is working'
        }
    }

    @Get('health')
    getHealth() {
        return {
            message: 'Audio API is Healthy'
        }
    }

    @Post('extract-audio')
    async extractAudio (@Body() body : { url: string }, @Res() res: Response) {
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
}
