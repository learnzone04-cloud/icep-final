export declare class GmailService {
    private gmail;
    constructor();
    setOAuth2Client(oauth2Client: any): void;
    createMessage(to: string, subject: string, body: string): string;
    sendEmail(to: string, subject: string, body: string): Promise<{
        success: boolean;
        messageId: any;
        threadId: any;
    }>;
    sendEmailWithOAuth(oauth2Client: any, to: string, subject: string, body: string): Promise<{
        success: boolean;
        messageId: any;
        threadId: any;
    }>;
    createTeacherApprovalEmail(teacherEmail: string, teacherName: string): {
        subject: string;
        body: string;
    };
    sendTeacherApprovalEmailWithOAuth(oauth2Client: any, teacherEmail: string, teacherName: string): Promise<{
        success: boolean;
        messageId: any;
        threadId: any;
    }>;
    sendTeacherApprovalEmail(teacherEmail: string, teacherName: string): Promise<{
        success: boolean;
        messageId: any;
        threadId: any;
    }>;
    createTeacherDisapprovalEmail(teacherEmail: string, teacherName: string, reasons: string): {
        subject: string;
        body: string;
    };
    sendTeacherDisapprovalEmailWithOAuth(oauth2Client: any, teacherEmail: string, teacherName: string, reasons: string): Promise<{
        success: boolean;
        messageId: any;
        threadId: any;
    }>;
}
