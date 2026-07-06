import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    socket: null,
    onlineUsers: [],

    signup: async(data) => {
        set({isSigningUp: true})
        try {
            const res = await axiosInstance.post('/auth/signup', data);
            set({authUser: res.data})
            toast.success("Account created successfully!")
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({isSigningUp: false})
        }
    },

    login: async(email, password) => {
        set({isLoggingIn: true})
        try {
            const res = await axiosInstance.post('/auth/login', {email, password})
            set({authUser: res.data})
            toast.success("Logged in successfully")
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({isLoggingIn: false})
        }
    },

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });
            get().connectSocket();
        } catch (error) {
            console.log("Error in authCheck:", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");
            get().disconnectSocket();
        } catch (error) {
            toast.error("Error logging out");
            console.log("Logout error:", error);
        }
    },

    blockUser: async (userId) => {
        try {
            await axiosInstance.post(`/auth/block/${userId}`);
            toast.success("User Blocked successfully");
        } catch (error) {
            toast.error("Unable to block user");
            console.log("Block error:", error);
        }
    },

    unblockUser: async (userId) => {
        try {
            await axiosInstance.delete(`/auth/block/${userId}`);
            toast.success("User Unlocked successfully");
        } catch (error) {
            toast.error("Unable to unblock user");
            console.log("Unblock error:", error);
        }
    },

    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;
        const socket = io("http://localhost:3000", {
            withCredentials: true, 
        });
        socket.connect();
        set({ socket });
        socket.on("getOnlineUsers", (userIds) => {
        set({ onlineUsers: userIds });
    });
    },

    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    },
}))