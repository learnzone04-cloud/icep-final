import { Body, Controller, Get, Post, Query, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { YoutubeService } from './youtube.service';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth/google')
export class YoutubeController {
    constructor(private readonly youtubeService: YoutubeService) {}

@Get('callback')
async googleCallback(@Query('code') code: string, @Res() res: Response) {
    const tokens = await this.youtubeService.getAccessToken(code);
    // Store tokens in memory, session, or database here
    this.youtubeService.setTokens(tokens);
    res.redirect('/auth/google/upload'); 
}

    @Post('upload')
    @UseInterceptors(FileInterceptor('videoFile')) // 'videoFile' must match the key in form-data
    async uploadVideo(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: { title: string; description: string },
    ) {
        return await this.youtubeService.uploadVideo(body.title, body.description, file.path);
    }

    @Get()
    googleAuth(@Res() res: Response) {
    const authUrl = this.youtubeService.oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/youtube.upload'],
    });
    res.redirect(authUrl);
}

@Get('upload')
uploadPage() {
    return { message: 'Upload your video here.' }; // A front-end upload form could go here
}
}