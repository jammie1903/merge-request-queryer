import "./server";
import { CronJob } from "cron";
import ReportGenerator from "./report-generator";
import reportCache from "./report-cache";

const reportGenerator = new ReportGenerator();

new CronJob({
    cronTime: '0 */2 * * *',
    onTick: async function ()  {
        console.log("starting");
        const report = await reportGenerator.run();
        reportCache.set(report);
    },
    start: true,
    runOnInit: !reportCache.loaded,
});
