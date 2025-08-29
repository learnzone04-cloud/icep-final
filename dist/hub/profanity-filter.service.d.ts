import { OnModuleInit } from '@nestjs/common';
export type HubLanguage = 'english' | 'german';
export declare class ProfanityFilterService implements OnModuleInit {
    private readonly logger;
    private glin;
    readonly HIDDEN = "(this message is hidden due to inappropriate content )";
    onModuleInit(): void;
    normalizeLanguage(typeName?: string): HubLanguage;
    check(text: string, lang: HubLanguage): boolean;
    sanitize(text: string, lang: HubLanguage): {
        isProfane: boolean;
        result: string;
    };
}
