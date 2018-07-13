import * as express from "express";
import * as path from "path";
import * as bodyParser from "body-parser";
import * as logger from "morgan";
import * as HttpErrors from "http-errors";
import { getScoreboardPage, getUnauthorisedPage } from "./react";
import reportCache from "./report-cache";
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(logger("common"));

const PASSWORD = process.env.PASSWORD || "password123";
const RUNTIME_SECRET = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

app.use(express.static(path.resolve(__dirname, "../static")));

app.get("/" + RUNTIME_SECRET, (req, res) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(getScoreboardPage(reportCache.get()));
});

app.get("/test/:secret", (req, res) => {
    res.json({ matched: req.params.secret === RUNTIME_SECRET });
});

app.post("/authenticate", (req, res) => {
    if(req.body.password === PASSWORD) {
        res.redirect("/" + RUNTIME_SECRET);   
    }
});


app.get("/*", (req, res) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(getUnauthorisedPage());
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!(err instanceof HttpErrors.HttpError)) {
        console.error(err);
        err = new HttpErrors.InternalServerError();
    }
    res.statusCode = (err as HttpErrors.HttpError).statusCode;
    res.jsonp(err);
});

app.listen(Number(process.env.PORT) || 3000, "0.0.0.0", () => {
    console.log("listening on 3000");
});
