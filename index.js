import express from "express";
import "dotenv/config.js";
import cors from "cors";
import Routes from "./routes/index.js";
import db from "./config/db.js";
import { createRouteHandler } from "uploadthing/express";
import { uploadRouter } from "./upload/uploadthing.js";

let port = 2000;
let app = express();

app.use(cors());
app.use(express.json());
app.use(Routes);

app.use("/api/upload-image", createRouteHandler({ router: uploadRouter }));
async function getTable(){
    await db.sync()
    console.log('table success added')
}

getTable()

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});