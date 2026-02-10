import express from "express";
import cors from "cors";
import Routes from "./routes/index.js";
import db from "./config/db.js";

let port = process.env.PORT || 2000;
let app = express();

app.use(cors());
app.use(express.json());
app.use(Routes);
async function getTable(){
    await db.sync()
    console.log('table success added')
}

getTable()

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});