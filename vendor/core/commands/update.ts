import { Command } from "@/vendor/commands";
import { exec } from "child_process";
import { promisify } from "util";
import * as fs from "fs";
import * as path from "path";

const execAsync = promisify(exec);

const UpdateCommand: Command = {
  aliases: ["update"],
  description: "Update overreact",
  async handler(args: any) {
    const repoUrl = "https://github.com/Damian-Mostert/overreact";
    const tempDir = path.join(process.cwd(), ".temp-update");
    const vendorPath = path.join(process.cwd(), "vendor");
    const backupPath = path.join(process.cwd(), "vendor.backup");

    try {
      console.log("🔄 Starting update process...");

      console.log("📥 Downloading latest vendor folder...");
      await execAsync(`git clone --depth 1 --filter=blob:none --sparse ${repoUrl} ${tempDir}`);
      await execAsync(`git sparse-checkout set vendor`, { cwd: tempDir });

      console.log("💾 Backing up current vendor folder...");
      if (fs.existsSync(vendorPath)) {
        if (fs.existsSync(backupPath)) {
          fs.rmSync(backupPath, { recursive: true, force: true });
        }
        fs.renameSync(vendorPath, backupPath);
      }

      console.log("📦 Installing new vendor folder...");
      fs.renameSync(path.join(tempDir, "vendor"), vendorPath);

      console.log("🧹 Cleaning up...");
      fs.rmSync(tempDir, { recursive: true, force: true });
      if (fs.existsSync(backupPath)) {
        fs.rmSync(backupPath, { recursive: true, force: true });
      }

      console.log("✅ Update completed successfully!");
    } catch (error) {
      console.error("❌ Update failed:", error);
      
      if (fs.existsSync(backupPath)) {
        console.log("🔄 Restoring backup...");
        if (fs.existsSync(vendorPath)) {
          fs.rmSync(vendorPath, { recursive: true, force: true });
        }
        fs.renameSync(backupPath, vendorPath);
        console.log("✅ Backup restored");
      }

      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    }
  },
};
export default UpdateCommand;
