import User from "../model/User.model.js";
import Message from "../model/Message.model.js";
import Group from "../model/Group.model.js";
import GroupMessage from "../model/GroupMessages.model.js";

export const getAllGroups = async(req, res) => {
    try {
        const loggedInUserId = req.user._id
        const groups = await Group.find({
            members: loggedInUserId
        })
        return res.status(200).json(groups)
    } catch (error) {
        console.log("error in getAllGroups", error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

export const createGroup = async(req, res) => {
    console.log("Create Group")
    try {
        const { members, name } = req.body
        const loggedInUserId = req.user._id
        if(members.length < 2) return res.status(400).json({message: "Atleast 2 members are required"});
        if(!name) return res.status(400).json({message: "Name of the Group is required"});

        const newGroup = new Group({
            name,
            members: [...members, loggedInUserId],
            admin: loggedInUserId
        })
        const savedGroup = await newGroup.save()
        return res.status(200).json({message: "Group created successfully"})
    } catch (error) {
        console.log("error in createGroup", error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

export const getAllMembers = async(req, res) => {
    try {
        const {id: groupId} = req.params
        const group = await Group.findById(groupId)
            .populate("members", "fullName profilePic")
        return res.status(200).json(group.members)
    } catch (error) {
        console.log("error in getAllMembers", error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

export const addMember = async(req, res) => {

}

export const getGroupMessages = async(req, res) => {
    try {
        const myId = req.user._id
        const {id: groupId} = req.params
        const messages = await GroupMessage.find({
            groupId
        }).populate("senderId", "fullName")
        return res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const sendGroupMessage = async(req, res) => {
    try {
        const myId = req.user._id;
        const {text, image} = req.body
        const {id: groupId} = req.params
        if (!text && !image) return res.status(400).json({ message: "Text or image is required." });
        const groupExists = await Group.exists({_id: groupId})
        if(!groupExists) return res.status(404).json({ message: "Group not found." });
        let imageurl

        const newMessage = new GroupMessage({
            senderId: myId,
            groupId,
            text,
            image: imageurl
        })
        await newMessage.save()
        await newMessage.populate("senderId", "fullName")
        // const receiverSocketId = getReceiverSocketId(receiverId);
        // if (receiverSocketId) {
        //     io.to(receiverSocketId).emit("newMessage", newMessage);
        // }
        return res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendGroupMessage controller: ", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const kickUser = async(req, res) => {
    try {
        const {groupId, userId} = req.params
        const group = await Group.findById(groupId);
        if(!group) return res.status(400).json({message: "Group does not exists"});
        if(group.members.includes(userId)) {
            const newGroup = await Group.findByIdAndUpdate(
                groupId,
                {
                    $pull: {
                        members: userId,
                    },
                },
                {
                    new: true,
                }
            ).populate("members", "fullName profilePic");
            console.log("newGroup", newGroup)
            return res.status(200).json(newGroup.members)
        } else return res.status(400).json({message: "User does belong to this group"})
    } catch (error) {
        console.log("kick Member error", error)
        return res.status(400).json({message: "Error while kicking"})
    }
}