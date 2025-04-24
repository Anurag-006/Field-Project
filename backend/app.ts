import express from "express";
import cors from "cors";
import { userRouter } from "./apis/user.api.js";
import { publicationRouter } from "./apis/publication.api.js";
const app = express();


app.use(express.json());
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));


app.get("/test", (req, res) => {
    res.send("This is a test");
})

app.use("/user",userRouter)
app.use("/publication", publicationRouter)
export {app};