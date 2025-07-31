import nodemailer from 'nodemailer';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface ReplyEmailData {
  to: string;
  fromName: string;
  originalSubject: string;
  originalMessage: string;
  replyMessage: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    // For development, we'll use a test account
    // In production, you would use real SMTP credentials
    this.initializeTransporter();
  }

  private initializeTransporter() {
    // For development/testing, you can use services like:
    // - Ethereal Email (fake SMTP for testing)
    // - Gmail SMTP
    // - SendGrid
    // - AWS SES
    
    // For now, we'll create a test account
    // In production, replace with your actual SMTP settings
    const testAccount = {
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: 'test@example.com',
        pass: 'testpass'
      }
    };

    try {
      this.transporter = nodemailer.createTransport(testAccount);
    } catch (error) {
      console.error('Failed to initialize email transporter:', error);
      this.transporter = null;
    }
  }

  async sendReplyEmail(data: ReplyEmailData): Promise<boolean> {
    if (!this.transporter) {
      console.error('Email transporter not initialized');
      return false;
    }

    try {
      const mailOptions = {
        from: `"MindPulse Support" <support@mindpulse.com>`,
        to: data.to,
        subject: `Re: ${data.originalSubject}`,
        html: this.generateReplyEmailHTML(data),
        text: this.generateReplyEmailText(data),
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  private generateReplyEmailHTML(data: ReplyEmailData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Reply from MindPulse Support</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 20px; }
          .original-message { background: #e9ecef; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; }
          .reply-message { background: white; padding: 15px; border-left: 4px solid #28a745; margin: 20px 0; }
          .footer { background: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #6c757d; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>MindPulse Support</h1>
            <p>Thank you for contacting us</p>
          </div>
          
          <div class="content">
            <p>Dear ${data.fromName},</p>
            
            <p>Thank you for reaching out to MindPulse support. We have received your message and are responding to your inquiry.</p>
            
            <div class="original-message">
              <h4>Your Original Message:</h4>
              <p><strong>Subject:</strong> ${data.originalSubject}</p>
              <p>${data.originalMessage.replace(/\n/g, '<br>')}</p>
            </div>
            
            <div class="reply-message">
              <h4>Our Response:</h4>
              <p>${data.replyMessage.replace(/\n/g, '<br>')}</p>
            </div>
            
            <p>If you have any further questions or need additional assistance, please don't hesitate to contact us again.</p>
            
            <p>Best regards,<br>The MindPulse Support Team</p>
          </div>
          
          <div class="footer">
            <p>This is an automated response from MindPulse Support</p>
            <p>© 2024 MindPulse. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateReplyEmailText(data: ReplyEmailData): string {
    return `
MindPulse Support - Response to Your Inquiry

Dear ${data.fromName},

Thank you for reaching out to MindPulse support. We have received your message and are responding to your inquiry.

Your Original Message:
Subject: ${data.originalSubject}
${data.originalMessage}

Our Response:
${data.replyMessage}

If you have any further questions or need additional assistance, please don't hesitate to contact us again.

Best regards,
The MindPulse Support Team

---
This is an automated response from MindPulse Support
© 2024 MindPulse. All rights reserved.
    `;
  }

  // Method to test email configuration
  async testConnection(): Promise<boolean> {
    if (!this.transporter) {
      return false;
    }

    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('Email connection test failed:', error);
      return false;
    }
  }
}

export const emailService = new EmailService(); 