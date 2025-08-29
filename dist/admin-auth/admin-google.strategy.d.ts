import { Strategy } from 'passport-google-oauth20';
import { AdminAuthService } from './admin-auth.service';
import { ConfigService } from '@nestjs/config';
declare const AdminGoogleStrategy_base: new (...args: [options: import("passport-google-oauth20").StrategyOptionsWithRequest] | [options: import("passport-google-oauth20").StrategyOptions] | [options: import("passport-google-oauth20").StrategyOptions] | [options: import("passport-google-oauth20").StrategyOptionsWithRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class AdminGoogleStrategy extends AdminGoogleStrategy_base {
    private adminAuthService;
    private readonly configService;
    constructor(adminAuthService: AdminAuthService, configService: ConfigService);
    validate(accessToken: string, refreshToken: string, profile: any): Promise<{
        youtubeTokens: {
            accessToken: string;
            refreshToken: string;
        };
        id: any;
        email: any;
        name: any;
        picture: any;
        role: string;
    }>;
}
export {};
