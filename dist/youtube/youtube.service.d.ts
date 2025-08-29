export declare class YoutubeService {
    oauth2Client: any;
    private youtube;
    tokens: any;
    constructor();
    getAccessToken(code: string): Promise<any>;
    setTokens(tokens: any): void;
    setTokensAndConfigure(tokens: any): void;
    refreshAccessToken(): Promise<void>;
    uploadVideo(title: string, description: string, filePath: string): Promise<any>;
    deleteVideo(videoId: string): Promise<any>;
}
