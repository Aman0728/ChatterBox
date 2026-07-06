import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { useAuthStore } from "./useAuthStore";

export const useGroupStore = create((set, get) => ({
    allGroups: [],
    isGroupLoading: false,
    isGroupMessagesLoading: false,
    selectedGroup: null,
    groupMessages: [],
    groupMembers: [],

    setSelectedGroup: (group) => {
        set({selectedGroup: group})
    },

    getAllGroups: async() => {
        set({isGroupLoading: true})
        try {
            const res = await axiosInstance.get("/group/allgroups")
            set({allGroups: res.data})
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            set({isGroupLoading: false})
        }
    },

    createGroup: async(name, members) => {
        try {
            const res = await axiosInstance.post("/group/create", {name, members})
            toast.success("Group created successfully")
        } catch (error) {
             toast.error(error.response?.data?.message || "Something went wrong");
        }
    },

    leaveGroup: async() => {

    },

    kickMember: async(groupId, userId) => {
        console.log("1 Kick function called")
        try {
            console.log("2 Before axios request")
            const res = await axiosInstance.patch(`/group/kick/${groupId}/${userId}`)
            console.log("3 After axios request")
            set({groupMembers: res.data})
            console.log("4 Member Kicked")
            toast.success("Member Kicked Successfully")
            console.log("5 After Toast")
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || "Something went wrong")
        }
    },

    dissolveGroup: async() => {

    },

    getGroupMessages: async(groupId) => {
        set({ isGroupMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/group/${groupId}`);
            set({ groupMessages: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            set({ isGroupMessagesLoading: false });
        }
    },

    sendGroupMessage: async (messageData) => {
        const { selectedGroup, groupMessages } = get();
        const { authUser } = useAuthStore.getState();

        const tempId = `temp-${Date.now()}`;

        const optimisticMessage = {
            _id: tempId,
            senderId: {
                _id: authUser._id,
                fullName: authUser.fullName
            },
            groupId: selectedGroup._id,
            text: messageData.text,
            image: messageData.image,
            createdAt: new Date().toISOString(),
            isOptimistic: true, 
        };
    
        set({ groupMessages: [...groupMessages, optimisticMessage] });

        try {
            const res = await axiosInstance.post(`/group/send/${selectedGroup._id}`, messageData);
            set({ groupMessages: groupMessages.concat(res.data) });
        } catch (error) {
            set({ groupMessages: groupMessages });
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    },

    getGroupMembers: async(groupId) => {
        const { groupMembers } = get()
        try {
            const res = await axiosInstance.get(`/group/members/${groupId}`)
            set({groupMembers: res.data})
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong")
        }
    },

}))