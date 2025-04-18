import dotenv from "dotenv";
dotenv.config({
  path: "./.env"
})
import connectDB from "./db/index.js";
import {app} from "./app.js"

connectDB()
.then(() => {
    app.listen(process.env.PORT || 5000, () => {
        console.log(`⚙️  SERVER is running at PORT: ${process.env.PORT}`);
    })
})
.catch((err) => console.log("MONOGODB connection failed: ",err))