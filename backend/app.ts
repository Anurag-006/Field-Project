import express from "express";
import cors from "cors";
import { userRouter } from "./apis/user.api.js";
import { publicationRouter } from "./apis/publication.api.js";
const app = express();


app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));


app.post("/test", (req, res) => {
    res.status(200).json({ message: "Success", data: req.body });
    console.log(req.body);
})

app.use("/user",userRouter)
app.use("/publication", publicationRouter)
export {app};