import { CronJob } from "cron";
import { activeAIWhenFailed } from "./checkGeminiAIStatus";

const jobSchedules = CronJob.from({
    cronTime: "* */30 * * * *",
    onTick: async () => {
        await activeAIWhenFailed();
    },
    start: true,
    timeZone: "Asia/Bangkok",
})

export default jobSchedules;