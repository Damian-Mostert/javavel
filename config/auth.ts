import { env } from "@/vendor/utils";

const AuthConfig: AuthConfig = {
  mode: env("AUTH_MODE", "jwt"),
  secret: env("AUTH_SECRET", "change-this-secret-key"),
  expiresIn: "7d",
  refreshExpiresIn: "30d",
  guards: {
    web: "session",
    api: "jwt",
  },
};

export default AuthConfig;
