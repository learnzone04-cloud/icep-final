import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleCalendarService {
  private oauth2Client: OAuth2Client;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_ADMIN_CALLBACK_URL
    );
    // You may need to set credentials (tokens) here if not using a session
  }

  setCredentials(tokens: any) {
    this.oauth2Client.setCredentials(tokens);
  }

  async createMeetEvent({
    summary,
    description,
    start,
    end,
    attendees,
    timeZone = 'UTC+3', // default to Syrian time zone
  }: {
    summary: string;
    description?: string;
    start: string; // ISO string
    end: string;   // ISO string
    attendees: string[];
    timeZone?: string;
  }): Promise<string> {
    const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
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
      guestsCanSeeOtherGuests: true, // optional
    };
    const res = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
      conferenceDataVersion: 1,
      sendUpdates: 'all',
    });
    return res.data.conferenceData?.entryPoints?.find(e => e.entryPointType === 'video')?.uri || '';
  }
} 