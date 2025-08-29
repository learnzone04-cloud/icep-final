"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleCalendarService = void 0;
const common_1 = require("@nestjs/common");
const googleapis_1 = require("googleapis");
let GoogleCalendarService = class GoogleCalendarService {
    constructor() {
        this.oauth2Client = new googleapis_1.google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_ADMIN_CALLBACK_URL);
    }
    setCredentials(tokens) {
        this.oauth2Client.setCredentials(tokens);
    }
    async createMeetEvent({ summary, description, start, end, attendees, timeZone = 'UTC+3', }) {
        const calendar = googleapis_1.google.calendar({ version: 'v3', auth: this.oauth2Client });
        const event = {
            summary,
            description,
            start: { dateTime: start, timeZone },
            end: { dateTime: end, timeZone },
            attendees: attendees.map(email => ({ email })),
            conferenceData: {
                createRequest: {
                    requestId: Math.random().toString(36).substring(2),
                    conferenceSolutionKey: { type: 'hangoutsMeet' },
                },
            },
            guestsCanJoin: true,
            guestsCanInviteOthers: true,
            guestsCanModify: true,
            guestsCanSeeOtherGuests: true,
        };
        const res = await calendar.events.insert({
            calendarId: 'primary',
            requestBody: event,
            conferenceDataVersion: 1,
            sendUpdates: 'all',
        });
        return res.data.conferenceData?.entryPoints?.find(e => e.entryPointType === 'video')?.uri || '';
    }
};
exports.GoogleCalendarService = GoogleCalendarService;
exports.GoogleCalendarService = GoogleCalendarService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], GoogleCalendarService);
//# sourceMappingURL=google-calendar.service.js.map