import * as React from "react";
import Header from "./Header";

export default class Authenticate extends React.Component {

    render() {
        return (
            <div className="App">
                <Header />
                <div className="Authenticate loading">
                    <h2 className="loading-mssage">Loading...</h2>
                    <div className="auth-container">
                        <h2>You're not authenticated</h2>
                        <form action="/authenticate" method="POST">
                            <div>
                                Enter Password: <input id="password" type="password" name="password" autoComplete="password" required={true}></input>
                            </div>
                            <input type='text' id="username" name='username' style={{ display: "none" }}></input>
                            <button type="submit" value="login">Login</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}