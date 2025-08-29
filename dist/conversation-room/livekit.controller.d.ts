import { LiveKitService } from './livekit.service';
import { Request } from 'express';
export declare class LiveKitController {
    private readonly liveKitService;
    constructor(liveKitService: LiveKitService);
    getToken(body: {
        roomName: string;
    }, req: Request): Promise<{
        token: string;
        wsUrl: string;
        identity: string;
    }>;
    getDebugToken(roomName: string, req: Request): Promise<{
        token: string;
        wsUrl: string;
        identity: string;
        debug: {
            roomName: string;
            userInfo: {
                id: any;
                name: any;
                role: any;
                normalizedRole: any;
            };
        };
    }>;
    completeRoom(roomId: string, req: Request): Promise<{
        success: boolean;
        message: string;
    }>;
    cancelRoom(roomId: string, req: Request): Promise<{
        success: boolean;
        message: string;
    }>;
}
