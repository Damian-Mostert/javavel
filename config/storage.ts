import { env } from "@/vendor/utils";

const StorageConfig: StorageConfig = {
  default: env("STORAGE_DRIVER", "local"),
  disks: {
    local: {
      driver: "local",
      root: "storage/private",
    },
    public: {
      driver: "local",
      root: "storage/public",
      url: "/storage",
    },
  },
};

export default StorageConfig;
