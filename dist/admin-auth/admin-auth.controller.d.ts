import { ConfigService } from '@nestjs/config';
import { AdminAuthService } from './admin-auth.service';
import { Response } from 'express';
export declare class AdminAuthController {
    private adminAuthService;
    private readonly configService;
    constructor(adminAuthService: AdminAuthService, configService: ConfigService);
    googleAuth(): Promise<void>;
    initiateGoogleAuth(redirectUri?: string): Promise<{
        authUrl: string;
        message: string;
    }>;
    googleAuthRedirect(req: any, res: Response, redirectUri?: string): Promise<void>;
    googleAuthCallbackJson(req: any, res: Response): Promise<void>;
    verifyToken(req: any): Promise<{
        message: string;
        user: any;
    }>;
    getProfile(req: any): Promise<{
        message: string;
        user: any;
    }>;
}
