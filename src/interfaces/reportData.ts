import { Count } from "./count";
import { MRTimings } from "./mrTimings";

export interface ReportData {
    comments: Count[];
    approvals: Count[];
    creationTime: number;
    totalApprovals: number;
    timings: MRTimings[]
}
