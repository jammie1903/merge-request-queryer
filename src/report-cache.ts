import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { ReportData } from "./interfaces/reportData";
const fileLocation = "report.json";

export class ReportCache {
    private _report: ReportData | null;
    constructor() {
        try {
            this._report = JSON.parse(readFileSync(fileLocation).toString()) as ReportData;
        } catch(e) {
            this._report = null;
        }
    }

    public get loaded() {
        return !!this._report
    }

    public get(): ReportData | null {
        return this._report;
    }

    public set(report: ReportData | null) {
        this._report = report;
        writeFileSync(fileLocation, JSON.stringify(this._report, null, ' '));
    }
}

export default new ReportCache();