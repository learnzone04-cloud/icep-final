export declare class GoogleCalendarService {
    private oauth2Client;
    constructor();
    setCredentials(tokens: any): void;
    createMeetEvent({ summary, description, start, end, attendees, timeZone, }: {
        summary: string;
        description?: string;
        start: string;
        end: string;
        attendees: string[];
        timeZone?: string;
    }): Promise<string>;
}
