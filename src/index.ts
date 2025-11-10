import "dotenv/config";
import cron from "node-cron";
import { scanAndNotify } from "./scan_both";

const CRON = "*/30 * * * *"; // 30분마다
cron.schedule(CRON, () => scanAndNotify().catch(console.error), {
  timezone: "Asia/Seoul",
});
scanAndNotify().catch(console.error);
