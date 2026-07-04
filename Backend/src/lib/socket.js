import { Server } from 'socket.io'
import http from 'http'
import express from 'express'
import { ENV } from './env.js'
import { socketAuthMiddleware } from '../middleware/socketAuth.middleware.js'

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    }
})

io.use(socketAuthMiddleware)

const userSocketMap = {}

export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

io.on("connection", (socket) => {
    console.log("User connected", socket.user.fullName)
    userSocketMap[socket.userId] = socket.id 

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnection", () => {
        console.log("A user disconnected", socket.user.fullName);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
})

export { io, app, server };