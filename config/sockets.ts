import { env } from "@/vendor/utils";

const SocketsConfig: SocketsConfig = {
  enabled: env("SOCKETS_ENABLED", true),
  port: env("SOCKETS_PORT", 3001),
  cors: {
    origin: env("SOCKETS_CORS_ORIGIN", "*"),
    credentials: true,
  },
  async authenticate() {
    return true;
  },
};

export default SocketsConfig;
