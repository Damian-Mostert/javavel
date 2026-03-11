import authMiddleware from "@/app/Http/Middleware/authMiddleware";
import cmsMiddleware from "@/app/Http/Middleware/cmsMiddleware";

const CmsConfig: CmsConfig = {
  icon: "/overreact.png",
  theme: {
    background: "white",
    forground: "black",
    accent_1: "lime",
    accent_2: "green",
    accent_3: "darkgreen",
    icons: "red",
  },
  middleware: [new authMiddleware(), new cmsMiddleware()],
};

export default CmsConfig;
