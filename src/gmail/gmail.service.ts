import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';

@Injectable()
export class GmailService {
  private gmail;

  constructor() {
    this.gmail = google.gmail({ version: 'v1' });
  }

  // Set OAuth2 client for Gmail (use the same one from YouTube service)
  setOAuth2Client(oauth2Client: any) {
    this.gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  }

  // Create email message
  createMessage(to: string, subject: string, body: string) {
    const message = [
      'Content-Type: text/html; charset=utf-8',
      'MIME-Version: 1.0',
      `To: ${to}`,
      `Subject: ${subject}`,
      '',
      body
    ].join('\n');

    return Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
  }

  // Send email
  async sendEmail(to: string, subject: string, body: string) {
    try {
      const message = this.createMessage(to, subject, body);
      
      const response = await this.gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: message,
        },
      });

      return {
        success: true,
        messageId: response.data.id,
        threadId: response.data.threadId,
      };
    } catch (error) {
      console.error('Gmail send error:', error.message);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  // Send email with OAuth2 client (for admin operations)
  async sendEmailWithOAuth(oauth2Client: any, to: string, subject: string, body: string) {
    try {
      // Set the OAuth2 client for this request
      this.setOAuth2Client(oauth2Client);
      
      const message = this.createMessage(to, subject, body);
      
      const response = await this.gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: message,
        },
      });

      return {
        success: true,
        messageId: response.data.id,
        threadId: response.data.threadId,
      };
    } catch (error) {
      console.error('Gmail send error:', error.message);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  // Create teacher approval email template
  createTeacherApprovalEmail(teacherEmail: string, teacherName: string) {
    const subject = '🎉 Your Teacher Account Has Been Approved!';
    
    const body = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #007bff; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background: #f8f9fa; padding: 20px; border-radius: 0 0 5px 5px; }
          .button { display: inline-block; background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Congratulations!</h1>
            <p>Your Teacher Account Has Been Approved</p>
          </div>
          <div class="content">
            <h2>Hello ${teacherName},</h2>
            <p>Great news! Your teacher account application has been approved by our admin team.</p>
            
            <h3>What's Next?</h3>
            <ul>
              <li>✅ You can now log in to the application using your email and password</li>
              <li>✅ Start creating and uploading your course content</li>
              <li>✅ Set your availability and start teaching</li>
              <li>✅ Connect with students and grow your audience</li>
            </ul>
            
            <p><strong>Ready to get started?</strong></p>
            <p>You can now log in to the application using your email address and password that you used during registration.</p>
            
            <h3>Need Help?</h3>
            <p>If you have any questions or need assistance getting started, please don't hesitate to contact our support team.</p>
            
            <p>Best regards,<br>
            <strong>The ICEP Team</strong></p>
          </div>
          <div class="footer">
            <p>This email was sent to ${teacherEmail}</p>
            <p>© 2025 ICEP Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return { subject, body };
  }

  // Send teacher approval email with OAuth2 client
  async sendTeacherApprovalEmailWithOAuth(oauth2Client: any, teacherEmail: string, teacherName: string) {
    const { subject, body } = this.createTeacherApprovalEmail(teacherEmail, teacherName);
    return this.sendEmailWithOAuth(oauth2Client, teacherEmail, subject, body);
  }

  // Send teacher approval email (legacy method)
  async sendTeacherApprovalEmail(teacherEmail: string, teacherName: string) {
    const { subject, body } = this.createTeacherApprovalEmail(teacherEmail, teacherName);
    return this.sendEmail(teacherEmail, subject, body);
  }

  // Create teacher disapproval email template
  createTeacherDisapprovalEmail(teacherEmail: string, teacherName: string, reasons: string) {
    const subject = '📋 Teacher Account Application Update';
    
    const body = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc3545; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background: #f8f9fa; padding: 20px; border-radius: 0 0 5px 5px; }
          .reasons-box { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; margin: 15px 0; border-radius: 5px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📋 Application Update</h1>
            <p>Teacher Account Application Review</p>
          </div>
          <div class="content">
            <h2>Hello ${teacherName},</h2>
            <p>Thank you for your interest in becoming a teacher on our platform. We have carefully reviewed your application.</p>
            
            <h3>Application Status</h3>
            <p>Unfortunately, we are unable to approve your teacher account application at this time.</p>
            
            <h3>Review Feedback</h3>
            <div class="reasons-box">
              <strong>Reasons for disapproval:</strong><br>
              ${reasons}
            </div>
            
            <h3>What You Can Do</h3>
            <ul>
              <li>📝 Review the feedback provided above</li>
              <li>🔄 Address the concerns mentioned in the review</li>
              <li>📧 Consider submitting a new application in the future</li>
              <li>❓ Contact our support team if you have questions</li>
            </ul>
            
            <h3>Need Help?</h3>
            <p>If you have any questions about this decision or would like guidance on how to improve your application, please don't hesitate to contact our support team.</p>
            
            <p>We appreciate your interest in our platform and wish you the best of luck in your future endeavors.</p>
            
            <p>Best regards,<br>
            <strong>The ICEP Team</strong></p>
          </div>
          <div class="footer">
            <p>This email was sent to ${teacherEmail}</p>
            <p>© 2025 ICEP Platform. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return { subject, body };
  }

  // Send teacher disapproval email with OAuth2 client
  async sendTeacherDisapprovalEmailWithOAuth(oauth2Client: any, teacherEmail: string, teacherName: string, reasons: string) {
    const { subject, body } = this.createTeacherDisapprovalEmail(teacherEmail, teacherName, reasons);
    return this.sendEmailWithOAuth(oauth2Client, teacherEmail, subject, body);
  }
} 