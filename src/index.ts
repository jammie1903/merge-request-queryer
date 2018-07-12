import fetch from "node-fetch";
import config from "../config.json";

function get(url: string) {
    return fetch(`${config.domain}/${url}`,
        {
            headers: {
                "Private-token": config.privateToken,
            }
        })
        .then(res => {
            if (res.status === 200) {
                return res.json();
            }
            throw new Error(res.status.toString() + ' - ' + url);
        })
}

async function getMergeRequests() {
    let hasMore = true;
    let returnList: any[] = [];
    let page = 1;
    while (hasMore) {
        let data = await get(`api/v4/merge_requests?per_page=100&page=${page}&scope=all`);
        if (data.length < 100) {
            hasMore = false;
        }
        returnList = returnList.concat(data);
        page++;
    }
    return returnList;
}

async function getThumbsUpUsers(mr: any): Promise<string[]> {
    const awardedEmojis: any[] = await get(`api/v4/projects/${mr.project_id}/merge_requests/${mr.iid}/award_emoji`);
    return awardedEmojis.filter(ae => ae.name === "thumbsup")
        .map((ae: any) => ae.user.name);
}

async function getCommentsPerUser(mr: any): Promise<string[]> {
    let hasMore = true;
    let comments: any[] = [];
    let page = 1;
    while (hasMore) {
        let data = await get(`api/v4/projects/${mr.project_id}/merge_requests/${mr.iid}/notes?per_page=100&page=${page}`);
        if (data.length < 100) {
            hasMore = false;
        }
        comments = comments.concat(data);
        page++;
    }
    return comments.filter(comment => comment.author.id !== mr.author.id) // filter out comment on users own MR's, they shouldnt count
        .map((comment: any) => comment.author.name);

}

function printScoreBoard(counter: { [key: string]: number }) {
    Object.keys(counter)
        .map(name => ({ name, count: counter[name] }))
        .sort((o1, o2) => o2.count - o1.count)
        .forEach(entry => console.log(`${entry.name}: ${entry.count}`));
}

console.log("Fetching Merge Requests");
getMergeRequests().then(async mrs => {
    console.log("Fetching comments\n");
    const comments: Array<string[]> = await batchFetch(8, mrs, mr => getCommentsPerUser(mr));
    console.log("Fetching approvals\n");
    const approvals: Array<string[]> = await batchFetch(8, mrs, mr => getThumbsUpUsers(mr));
    const approvalsCounter: { [key: string]: number } = {};

    const commentsCounter: { [key: string]: number } = {};
    comments.forEach(commentedBy => {
        commentedBy.forEach(commenter => {
            const commentsCount = commentsCounter[commenter] || 0;
            commentsCounter[commenter] = commentsCount + 1;
        });
    });


    approvals.forEach(approvedBy => {
        approvedBy.forEach(approver => {
            const approvalCount = approvalsCounter[approver] || 0;
            approvalsCounter[approver] = approvalCount + 1;
        });
    });

    console.log(`
Comments Scoreboard
-------------------`);
    printScoreBoard(commentsCounter);

    console.log(`
Approvals Scoreboard
--------------------`);
    printScoreBoard(approvalsCounter);

});

function batchFetch<S, T>(max: number, data: S[], promiseGenerator: (entry: S) => Promise<T>): Promise<T[]> {
    let index = 0;
    let results: any[] = [];

    const next = (): Promise<void> => {
        if (index >= data.length) {
            return Promise.resolve();
        }
        const itemIndex = index++;
        console.log(`\u001b[1A${itemIndex + 1} of ${data.length}`);
        return promiseGenerator(data[itemIndex]).then(result => {
            results[itemIndex] = result;
            return next();
        });
    }
    let promises = [];
    for (let i = 0; i < max; i++) {
        promises.push(next());
    }

    return Promise.all(promises).then(() => results);
}
