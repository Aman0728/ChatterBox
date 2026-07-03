import express from "express";
import router from "./routes/auth.routes.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
dotenv.config()

const app = express();

const port = process.env.PORT

// app.get("/api/auth/sign", (req, res) => {
//     res.send("HELLO WORLD")
// })
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", router)

app.listen(port || 8000, () => {
    console.log(`server is running on port: ${port}`)
    connectDB();
})