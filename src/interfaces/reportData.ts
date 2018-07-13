import { Count } from "./count";

export interface ReportData {
    comments: Count[];
    approvals: Count[];
    creationTime: number;
}