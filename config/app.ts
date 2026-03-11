const AppConfig: AppConfig = {
  name: env("APP_NAME", "Overreact"),
  env: env("APP_ENV", "production"),
  debug: env("APP_DEBUG", false),
  url: env("APP_URL", "http://localhost:3000"),
  port: env("PORT", 3000),
  timezone: "UTC",
  locale: "en",
};

export default AppConfig;
