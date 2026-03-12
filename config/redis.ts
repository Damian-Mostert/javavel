import { env } from "@/vendor/utils";

const RedisConfig: RedisConfig = {
  host: env("REDIS_HOST", "localhost"),
  port: env("REDIS_PORT", 6379),
  password: env("REDIS_PASSWORD", ""),
  db: env("REDIS_DB", 0),
};

export default RedisConfig;
