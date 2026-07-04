import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
dotenv.config()
import authRouter from "./routes/auth.routes.js";
import messageRouter from "./routes/message.route.js"
import cookieparser from 'cookie-parser'
import cors from 'cors'
import { app, server } from "./lib/socket.js";



const port = process.env.PORT

// app.get("/api/auth/sign", (req, res) => {
//     res.send("HELLO WORLD")
// })
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser())
app.use(cors({ origin: "http://localhost:5173", credentials: true }))
app.use("/api/auth", authRouter)
app.use("/api/messages", messageRouter)

server.listen(port || 8000, () => {
    console.log(`server is running on port: ${port}`)
    connectDB();
})