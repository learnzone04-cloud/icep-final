import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import * as fs from 'fs';

@Injectable()
export class YoutubeService {
    public oauth2Client;
    private youtube;
    public tokens: any; // Made public so admin dashboard can check connection status

    constructor() {
        this.oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_CALLBACK_URL,
        );
        this.youtube = google.youtube({
            version: 'v3',
            auth: this.oauth2Client,
        });
    }

    async getAccessToken(code: string): Promise<any> {
        const { tokens } = await this.oauth2Client.getToken(code);
        this.oauth2Client.setCredentials(tokens);
        return tokens;
    }
    
    setTokens(tokens: any) {
        this.tokens = tokens; // Store tokens securely
        // Set the credentials on the OAuth client
        this.oauth2Client.setCredentials(tokens);
    }

    // New method to set tokens and ensure they're properly configured
    setTokensAndConfigure(tokens: any) {
        this.tokens = tokens;
        // Set the credentials on the OAuth client
        this.oauth2Client.setCredentials({
            access_token: tokens.accessToken,
            refresh_token: tokens.refreshToken,
            scope: tokens.scope || 'https://www.googleapis.com/auth/youtube.upload'
        });
    }

    async refreshAccessToken() {
        if (!this.tokens || !this.tokens.refresh_token) throw new Error("No refresh token available.");
        const { credentials } = await this.oauth2Client.refreshToken(this.tokens.refresh_token);
        this.oauth2Client.setCredentials(credentials);
        this.tokens = credentials; // Update tokens with new credentials
    }

    async uploadVideo(title: string, description: string, filePath: string): Promise<any> {
        // Ensure we have credentials set
        if (!this.oauth2Client.credentials || !this.oauth2Client.credentials.access_token) {
            throw new Error("YouTube credentials not set. Please authenticate first.");
        }

        const fileStream = fs.createReadStream(filePath); // Create a stream for the video
        const response = await this.youtube.videos.insert({
            part: 'snippet,status',
            requestBody: {
                snippet: {
                    title,
                    description,
                },
                status: {
                    privacyStatus: 'Unlisted', 
                },
            },
            media: {
                body: fileStream,
            },
        });
        return response.data; // Video details
    }

    async deleteVideo(videoId: string): Promise<any> {
        // Ensure we have credentials set
        if (!this.oauth2Client.credentials || !this.oauth2Client.credentials.access_token) {
            throw new Error("YouTube credentials not set. Please authenticate first.");
        }

        try {
            const response = await this.youtube.videos.delete({
                id: videoId,
            });
            return response.data;
        } catch (error) {
            throw new Error(`Failed to delete video from YouTube: ${error.message}`);
        }
    }
}