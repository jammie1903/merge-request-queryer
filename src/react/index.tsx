import * as React from 'react';
import { renderToString } from "react-dom/server";
import App from "./components/App";

function htmlTemplate(reactDom: string) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Merge Requests Report</title>
        <link rel="stylesheet" type="text/css" href="styles.css">
    </head>
    
    <body>
        <div id="app">${reactDom}</div>
    </body>
    </html>
`;
}

export default (reportData: any) => {
    const reactDom = renderToString((
        <App {...(reportData || {})}/>
    ));
    return htmlTemplate(reactDom);
}
