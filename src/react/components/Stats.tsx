import * as React from "react";
import * as moment from "moment";
import { ReportData } from "../../interfaces/reportData";

export default class Stats extends React.Component<ReportData> {

    constructor(props: ReportData) {
        super(props);
    }

    percentageByTopThree(approvals = this.props.approvals, totalApprovals = this.props.totalApprovals) {
        let topThreeTotal: number = 0;
        for(let i = 0; i <= 3; i++) {
            topThreeTotal += approvals[i].count;
        }

        return Math.round((topThreeTotal / totalApprovals) * 100);
    }

    averageNumberOfApprovals(approvals = this.props.approvals, totalApprovals = this.props.totalApprovals) {
        return Math.round(totalApprovals / approvals.length);
    }

    averageOpenTime(timings = this.props.timings) {
        const differences: number[] = [];
        if (timings && timings.length > 0) {
            timings.forEach((record) => {
                const startDate = moment(record.start);
                const endDate = moment(record.end);
                differences.push(endDate.diff(startDate, 'hours'));
            });
            const sum = differences.reduce((a, b) => { return a + b; });
            return Math.round(sum / differences.length);
        }

        return 'N/A';
    }

    render() {
        return (
            <div className="stats">
                <div className="allTime">
                    <h2>All Time</h2>
                    <p className="percentageByTopThree">Percentage of approvals by Top Three Developers: {this.percentageByTopThree()}%</p>
                    <p className="average">Average number of reviews per developer: {this.averageNumberOfApprovals()}</p>
                    <p className="averageMrOpenTime">Average Time a Merge Request is Open: { this.averageOpenTime() } hours</p>
                </div>
            </div>
        );
    }
}
