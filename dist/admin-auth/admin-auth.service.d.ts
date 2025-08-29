import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class AdminAuthService {
    private jwtService;
    private readonly configService;
    constructor(jwtService: JwtService, configService: ConfigService);
    private readonly ALLOWED_ADMIN_EMAILS;
    private youtubeTokensStore;
    validateAdminUser(profile: any): Promise<{
        id: any;
        email: any;
        name: any;
        picture: any;
        role: string;
    }>;
    generateAdminToken(user: any): Promise<{
        accessToken: string;
        user: {
            id: any;
            email: any;
            name: any;
            picture: any;
            role: string;
        };
    }>;
    generateAdminTokenWithYouTube(user: any, youtubeTokens: any): Promise<{
        youtubeTokens: {
            accessToken: any;
            refreshToken: any;
            scope: string;
        };
        message: string;
        accessToken: string;
        user: {
            id: any;
            email: any;
            name: any;
            picture: any;
            role: string;
        };
    }>;
    getYouTubeTokens(adminEmail: string): any;
    hasYouTubeAccess(adminEmail: string): boolean;
    verifyAdminToken(token: string): Promise<any>;
}
