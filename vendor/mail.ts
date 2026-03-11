export interface Envelope {
  subject: string;
  from?: string;
  to?: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
}

export interface Attachment {
  path: string;
  filename?: string;
  contentType?: string;
}

export abstract class Mail {
  constructor(protected data?: any) {}

  abstract envelope(): Envelope;

  abstract content(): React.JSX.Element;

  attachments(): Attachment[] {
    return [];
  }

  async send(): Promise<void> {
    const envelope = this.envelope();
    const content = this.content();
    const attachments = this.attachments();

    // Mail sending logic here
    console.log('Sending mail:', envelope.subject);
  }

  static async dispatch(data?: any): Promise<void> {
    const mail = new (this as any)(data);
    return mail.send();
  }
}
