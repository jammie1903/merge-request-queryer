import * as React from "react";
import { ReportData } from "../../interfaces/reportData";
import ScoreBoard from "./ScoreBoard";
import Header from "./Header";
import Stats from "./Stats";

export default class App extends React.Component<ReportData> {

    constructor(props: ReportData) {
        super(props);
    }

    render() {

        if (!this.props.creationTime) {
            return <div>No report has yet been generated</div>;
        }

        return (
            <div className="App">
                <Header />
                <Stats { ...this.props }/>
                <div className="content">
                    <ScoreBoard title="Approvals" scores={this.props.approvals}></ScoreBoard>
                    <ScoreBoard title="Comments" scores={this.props.comments}></ScoreBoard>
                </div>
            </div>
        );
    }
}
