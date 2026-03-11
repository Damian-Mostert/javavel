import chalk from "chalk";
import fs from "fs";
import { join } from "path";

export default function MakeMail(name: string) {
  const filePath = join(
    process.cwd(),
    `./app/Mail/${name}Mail.tsx`,
  );
  if (fs.existsSync(filePath)) {
    throw new Error(chalk.redBright("Mail already exists"));
  }
  console.log("Making mail:", chalk.bold(chalk.yellowBright(name)));
  fs.writeFileSync(
    filePath,
    `import { Mail, Envelope, Attachment } from "@/vendor/mail";

export default class ${name}Mail extends Mail {
  constructor(data?: any) {
    super(data);
  }

  envelope(): Envelope {
    return {
      subject: '${name} Notification',
    };
  }

  content() {
    return (
      <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
        <h1>${name}</h1>
        <p>Hello {this.data?.name || 'there'},</p>
        <p>Your ${name.toLowerCase()} notification content goes here.</p>
      </div>
    );
  }

  attachments(): Attachment[] {
    return [];
  }
}
`,
  );
  console.log(
    `Mail: ${chalk.bold(chalk.yellowBright(name))} made at: ${chalk.bold(chalk.greenBright(filePath))}`,
  );
}
