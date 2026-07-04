import Message from "../model/Message.model.js"
import User from "../model/User.model.js"
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getAllContacts = async(req, res) => {
    try {
        const loggedInUserId = req.user._id
        console.log(loggedInUserId)
        const otherusers = await User.find({_id : {$ne: loggedInUserId}}).select("-password")
        return res.status(200).json(otherusers)
    } catch (error) {
        console.log("Error in getAllContacts:", error);
        return res.status(500).json({ message: "Server error" });
    }
}

export const getMessagesByUserId = async(req, res) => {
    try {
        const myId = req.user._id
        const {id: otherUser} = req.params
        const messages = await Message.find({
            $or: [
                {senderId: myId, receiverId: otherUser},
                {senderId: otherUser, receiverId: myId}
            ]
        })
        return res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const sendMessage = async(req, res) => {
    try {
        const myId = req.user._id;
        const {text, image} = req.body
        const {id: receiverId} = req.params
        if (!text && !image) return res.status(400).json({ message: "Text or image is required." });
        if(myId === receiverId) return res.status(400).json({ message: "Cannot send messages to yourself." });
        const receiverExists = await User.exists({_id: receiverId})
        if(!receiverExists) return res.status(404).json({ message: "Receiver not found." });
        let imageurl

        const newMessage = new Message({
            senderId: myId,
            receiverId,
            text,
            image: imageurl
        })
        await newMessage.save()
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        return res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const getChatPatners = async(req, res) => {
    try {
        const loggedInUserId = req.user._id
        const messages = await Message.find({
            $or: [{senderId: loggedInUserId}, {receiverId: loggedInUserId}]
        })
        const chatPatnersIds = [
            ...new Set(
                messages.map((msg) => 
                    msg.senderId.toString() === loggedInUserId.toString()
                    ? msg.receiverId.toString()
                    : msg.senderId.toString()
                )
            )
        ]
        const chatPatners = await User.find({_id: {$in: chatPatnersIds}}).select("-password")
        return res.status(200).json(chatPatners);
    } catch (error) {
        console.error("Error in getChatPartners: ", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
}