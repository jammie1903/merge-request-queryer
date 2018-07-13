
// import ReportGenerator from "./report-generator";

// function printScoreBoard(counter: { [key: string]: number }) {
//     Object.keys(counter)
//         .map(name => ({ name, count: counter[name] }))
//         .sort((o1, o2) => o2.count - o1.count)
//         .forEach(entry => console.log(`${entry.name}: ${entry.count}`));
// }

// new ReportGenerator().run().then(async results => {
//     console.log(`\nComments Scoreboard\n-------------------`);
//     printScoreBoard(results.comments);

//     console.log(`\nApprovals Scoreboard\n--------------------`);
//     printScoreBoard(results.approvals);
// });

import "./server";
import { CronJob } from "cron";
import ReportGenerator from "./report-generator";
import reportCache from "./report-cache";


const reportGenerator = new ReportGenerator();

new CronJob({
    cronTime: '00 00 00 * * 1-5',
    onTick: async function ()  {
        console.log("starting");
        const report = await reportGenerator.run();
        reportCache.set(report);
    },
    start: true,
    runOnInit: !reportCache.loaded,
});
