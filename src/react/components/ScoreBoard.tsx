import * as React from "react";
import { Count } from "../../interfaces/count";

export interface ScoreBoardProps {
    title: string;
    scores: Count[];
}

export default class App extends React.Component<ScoreBoardProps> {

    constructor(props: ScoreBoardProps) {
        super(props);
    }

    render() {
        return (
            <div className="ScoreBoard">
                <h2>{this.props.title}</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Pos</th>
                            <th>Name</th>
                            <th>{this.props.title}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.scores.map((score, index) => {
                            return (
                                <tr key={score.name}>
                                    <td>{index + 1}.</td>
                                    <td>{score.name}</td>
                                    <td>{score.count}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        );
    }
}
