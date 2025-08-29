import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
declare const AdminJwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class AdminJwtStrategy extends AdminJwtStrategy_base {
    private readonly configService;
    constructor(configService: ConfigService);
    validate(payload: any): Promise<{
        id: any;
        email: any;
        name: any;
        role: any;
        picture: any;
    }>;
}
export {};
