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
                            if (this.props.scores.length > 20 && index >= 16 && index < this.props.scores.length - 3) {
                                if (index !== 16) {
                                    return "";
                                }
                                return (
                                    <tr key={score.name}>
                                        <td className="table-gap" colSpan={3}>--------------------</td>
                                    </tr>
                                );
                            }

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