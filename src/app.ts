import express from "express";

// @ts-ignore
import bodyParser from "body-parser";
import helmet from "helmet";
import {router} from "./router";

const app: express.Application = express();
app.use(bodyParser.json());

if(process.env.ACTIVE_ENV === "PRODUCTION"){
    app.use(helmet());
}

app.use('/', router);
export default app;