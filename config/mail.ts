const MailConfig: MailConfig = {
  provider: env("MAIL_PROVIDER", "smtp"),
  from: {
    address: env("MAIL_FROM_ADDRESS", "noreply@overeact.dev"),
    name: env("MAIL_FROM_NAME", "Overeact"),
  },
  smtp: {
    host: env("MAIL_HOST", "localhost"),
    port: env("MAIL_PORT", 587),
    username: env("MAIL_USERNAME", ""),
    password: env("MAIL_PASSWORD", ""),
    encryption: env("MAIL_ENCRYPTION", "tls"),
  },
};

export default MailConfig;
