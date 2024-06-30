import express from "express";
import { PORT} from "./config.js";

const app = express();


/*test*/
app.listen(PORT, () => {
    console.log('app listening:${PORT}');
});