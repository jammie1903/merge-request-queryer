import fetch from "node-fetch";
import * as dotenv from "dotenv";
import { batchFetch } from "./utils";
import { ReportData } from "./interfaces/reportData";
import { MRTimings } from "./interfaces/mrTimings";

dotenv.config();

const config = {
    domain: process.env.DOMAIN || "",
    privateToken: process.env.PRIVATE_TOKEN || ""
}

export default class ReportGenerator {

    private get(url: string) {
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

    private async getMergeRequests() {
        let hasMore = true;
        let returnList: any[] = [];
        let page = 1;
        while (hasMore) {
            let data = await this.get(`api/v4/merge_requests?per_page=100&page=${page}&scope=all`);
            if (data.length < 100) {
                hasMore = false;
            }
            returnList = returnList.concat(data);
            page++;
        }
        return returnList;
    }

    private async getThumbsUpUsers(mr: any): Promise<string[]> {
        const awardedEmojis: any[] = await this.get(`api/v4/projects/${mr.project_id}/merge_requests/${mr.iid}/award_emoji`);
        return awardedEmojis.filter(ae => ae.name === "thumbsup")
            .map((ae: any) => ae.user.name);
    }

    private async getCommentsPerUser(mr: any): Promise<string[]> {
        let hasMore = true;
        let comments: any[] = [];
        let page = 1;
        while (hasMore) {
            let data = await this.get(`api/v4/projects/${mr.project_id}/merge_requests/${mr.iid}/notes?per_page=100&page=${page}`);
            if (data.length < 100) {
                hasMore = false;
            }
            comments = comments.concat(data);
            page++;
        }
        return comments.filter(comment => comment.author.id !== mr.author.id) // filter out comment on users own MR's, they shouldnt count
            .map((comment: any) => comment.author.name);

    }

    private counterToOrderedArray(counter: { [key: string]: number }) {
        return Object.keys(counter)
            .map(name => ({ name, count: counter[name] }))
            .sort((o1, o2) => o2.count - o1.count)
    }

    private getCommentCount(comments: Array<string[]>): any {
        const commentsCounter: { [key: string]: number } = {};

        comments.forEach(commentedBy => {
            commentedBy.forEach(commenter => {
                const commentsCount = commentsCounter[commenter] || 0;
                commentsCounter[commenter] = commentsCount + 1;
            });
        });

        return commentsCounter;
    }

    private getApprovalsCount(approvals: Array<string[]>): any {
        const approvalsCounter: { [key: string]: number } = {};
        approvals.forEach(approvedBy => {
            approvedBy.forEach(approver => {
                const approvalCount = approvalsCounter[approver] || 0;
                approvalsCounter[approver] = approvalCount + 1;
            });
        });

        return approvalsCounter
    }

    public async run(): Promise<ReportData> {

        console.log("Fetching Merge Requests");
        const mrs = await this.getMergeRequests();
        console.log("Fetching comments\n");
        const comments: Array<string[]> = await batchFetch(8, mrs, mr => this.getCommentsPerUser(mr));
        console.log("Fetching approvals\n");
        const approvals: Array<string[]> = await batchFetch(8, mrs, mr => this.getThumbsUpUsers(mr));

        const commentsCounter = this.getCommentCount(comments);
        const approvalsCounter = this.getApprovalsCount(approvals);

        const timings: MRTimings[] = [];

        mrs.forEach(record => {
            timings.push({ start: record.created_at, end: record.updated_at });
        });

        const orderedComments = this.counterToOrderedArray(commentsCounter);
        const orderedApprovals = this.counterToOrderedArray(approvalsCounter);

        let totalApprovals: number = 0;
        for(let i = 0; i < orderedApprovals.length; i++) {
            totalApprovals = totalApprovals + orderedApprovals[i].count;
        }

        return {
            comments: orderedComments,
            approvals: orderedApprovals,
            creationTime: new Date().getTime(),
            totalApprovals: totalApprovals,
            timings: timings
        }
    }
}
