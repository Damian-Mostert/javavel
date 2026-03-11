import { CommandKernel } from "@/vendor/kernel.ts";

const Kernel: CommandKernel = {
  commands: {},
  schedule(schedule) {
    schedule.command("telescope:prune").daily();
    schedule.command("api:products").hourly();
    schedule.command("comms:send").hourly();
    if (env("APP_ENV") == "production") {
      schedule.command("api:report").dailyAt("07:00");
      schedule.command("api:check").everyFifteenMinutes();
      schedule.command("ilead:gclid").weeklyOn("5", "9:00");
      schedule.command("ilead:gclid").weeklyOn("3", "9:00");
      schedule.command("ilead:gclid").weeklyOn("1", "9:00");
    }
  },
};

export default Kernel;
