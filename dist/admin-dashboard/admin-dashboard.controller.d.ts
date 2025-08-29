import { YoutubeService } from '../youtube/youtube.service';
export declare class AdminDashboardController {
    private readonly youtubeService;
    constructor(youtubeService: YoutubeService);
    testEndpoint(req: any): Promise<{
        message: string;
        user: any;
        timestamp: string;
    }>;
    getDashboard(req: any): Promise<{
        message: string;
        user: any;
        features: string[];
    }>;
    getYouTubeStatus(req: any): Promise<{
        message: string;
        user: any;
        youtubeConnected: boolean;
        channelInfo: {
            name: string;
            subscribers: number;
            videos: number;
        };
        statusMessage: string;
    }>;
    getUserStats(req: any): Promise<{
        message: string;
        user: any;
        stats: {
            totalStudents: number;
            totalTeachers: number;
            activeUsers: number;
            newUsersThisMonth: number;
        };
    }>;
    restartSystem(req: any): Promise<{
        message: string;
        user: any;
        timestamp: string;
    }>;
    uploadVideoToYouTube(req: any, file: Express.Multer.File, body: {
        title: string;
        description: string;
    }): Promise<{
        success: boolean;
        message: string;
        user: any;
        videoId?: undefined;
        videoTitle?: undefined;
        uploadedAt?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        user: any;
        videoId: any;
        videoTitle: any;
        uploadedAt: string;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        user: any;
        videoId?: undefined;
        videoTitle?: undefined;
        uploadedAt?: undefined;
    }>;
    getYouTubeConnectionStatus(req: any): Promise<{
        message: string;
        user: any;
        connected: boolean;
        connectionUrl: string;
        statusMessage: string;
    }>;
    refreshYouTubeTokens(req: any): Promise<{
        success: boolean;
        message: string;
        user: any;
        timestamp: string;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        user: any;
        timestamp?: undefined;
    }>;
}
