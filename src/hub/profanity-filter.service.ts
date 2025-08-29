import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Filter as GlinFilter } from 'glin-profanity';
import { checkGermanText } from 'bad-words-checker';

export type HubLanguage = 'english' | 'german';

@Injectable()
export class ProfanityFilterService implements OnModuleInit {
  private readonly logger = new Logger(ProfanityFilterService.name);        
  private glin: GlinFilter;
  readonly HIDDEN = '(this message is hidden due to inappropriate content )';

  onModuleInit() {
    this.glin = new GlinFilter({
      languages: ['english', 'german'],
      caseSensitive: false,
      wordBoundaries: true,
      allowObfuscatedMatch: true,
    });
    this.logger.log('Profanity filter initialized');
  }

  normalizeLanguage(typeName?: string): HubLanguage {
    const n = (typeName || '').toLowerCase();
    if (n.includes('german') || n === 'de' || n === 'ger' || n === 'de-de') return 'german';
    return 'english';
  }

  // returns true if profane
  check(text: string, lang: HubLanguage): boolean {
    // 1) bad-words-checker (priority) - only for German
    if (lang === 'german') {
      if (checkGermanText(text)) return true;
    }

    // 2) glin-profanity for both English and German
    return this.glin.isProfane(text);
  }

  sanitize(text: string, lang: HubLanguage): { isProfane: boolean; result: string } {
    const prof = this.check(text, lang);
    return prof ? { isProfane: true, result: this.HIDDEN } : { isProfane: false, result: text };
  }
}
