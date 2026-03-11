import { Mail, Envelope, Attachment } from "@/vendor/mail";

export default class ForgotPasswordMail extends Mail {
  constructor(data?: { email: string; resetToken: string; name?: string }) {
    super(data);
  }

  envelope(): Envelope {
    return {
      subject: 'Reset Your Password',
      to: this.data?.email,
    };
  }

  content() {
    const resetUrl = `${process.env.APP_URL}/reset-password?token=${this.data?.resetToken}`;
    
    return (
      <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
        <h1>Reset Your Password</h1>
        <p>Hello {this.data?.name || 'there'},</p>
        <p>You requested to reset your password. Click the button below to proceed:</p>
        <a 
          href={resetUrl} 
          style={{
            display: 'inline-block',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: '#ffffff',
            textDecoration: 'none',
            borderRadius: '5px',
            marginTop: '10px'
          }}
        >
          Reset Password
        </a>
        <p style={{ marginTop: '20px', color: '#666' }}>
          If you didn't request this, please ignore this email.
        </p>
      </div>
    );
  }

  attachments(): Attachment[] {
    return [];
  }
}

