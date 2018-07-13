import * as express from "express";
import * as path from "path";
import reactApp from "./react";
import reportCache from "./report-cache";
const app = express();

app.use(express.static(path.resolve(__dirname, "../static")));

app.get("/*", (req, res) => {
    console.log("hit router");
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(reactApp(reportCache.get()));
});

app.listen(3000, "0.0.0.0", () => {
    console.log("listening on 3000");
});

