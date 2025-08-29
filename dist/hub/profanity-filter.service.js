"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ProfanityFilterService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfanityFilterService = void 0;
const common_1 = require("@nestjs/common");
const glin_profanity_1 = require("glin-profanity");
const bad_words_checker_1 = require("bad-words-checker");
let ProfanityFilterService = ProfanityFilterService_1 = class ProfanityFilterService {
    constructor() {
        this.logger = new common_1.Logger(ProfanityFilterService_1.name);
        this.HIDDEN = '(this message is hidden due to inappropriate content )';
    }
    onModuleInit() {
        this.glin = new glin_profanity_1.Filter({
            languages: ['english', 'german'],
            caseSensitive: false,
            wordBoundaries: true,
            allowObfuscatedMatch: true,
        });
        this.logger.log('Profanity filter initialized');
    }
    normalizeLanguage(typeName) {
        const n = (typeName || '').toLowerCase();
        if (n.includes('german') || n === 'de' || n === 'ger' || n === 'de-de')
            return 'german';
        return 'english';
    }
    check(text, lang) {
        if (lang === 'german') {
            if ((0, bad_words_checker_1.checkGermanText)(text))
                return true;
        }
        return this.glin.isProfane(text);
    }
    sanitize(text, lang) {
        const prof = this.check(text, lang);
        return prof ? { isProfane: true, result: this.HIDDEN } : { isProfane: false, result: text };
    }
};
exports.ProfanityFilterService = ProfanityFilterService;
exports.ProfanityFilterService = ProfanityFilterService = ProfanityFilterService_1 = __decorate([
    (0, common_1.Injectable)()
], ProfanityFilterService);
//# sourceMappingURL=profanity-filter.service.js.map