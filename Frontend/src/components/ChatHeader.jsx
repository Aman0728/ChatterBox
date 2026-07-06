import { useChatStore } from "../store/useChatStore";
import { useEffect, useState, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { XIcon, MoreVertical, Ban, Trash2 } from "lucide-react";

function ChatHeader() {
  const { selectedUser, setSelectedUser, clearChat, checkBlocked, isSelectedUserBlocked } =
    useChatStore();
  const { onlineUsers, blockUser, unblockUser,  } = useAuthStore();
  const isOnline = onlineUsers.includes(selectedUser._id);

  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") setSelectedUser(null);
    };

    window.addEventListener("keydown", handleEscKey);

    // cleanup function
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [setSelectedUser]);

  const handleClearChat = async () => {
    if (!window.confirm("Clear this conversation?")) return;

    try {
      await clearChat(selectedUser._id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className="flex justify-between items-center bg-slate-800/50 border-b
   border-slate-700/50 max-h-[84px] px-6 flex-1"
    >
      <div className="flex items-center space-x-3">
        <div className={`avatar ${isOnline ? "online" : "offline"}`}>
          <div className="w-12 rounded-full">
            <img
              src={selectedUser.profilePic || "/avatar.png"}
              alt={selectedUser.fullName}
            />
          </div>
        </div>

        <div>
          <h3 className="text-slate-200 font-medium">
            {selectedUser.fullName}
          </h3>
          <p className="text-slate-400 text-sm">
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 relative" ref={menuRef}>
        <button
          onClick={() => setShowMenu((prev) => !prev)}
          className="p-2 rounded-lg hover:bg-slate-700 transition"
        >
          <MoreVertical className="w-5 h-5 text-slate-300" />
        </button>

        {showMenu && (
          <div
            className="absolute right-0 top-12 w-48 bg-slate-800
            border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden"
          >
            <button
              className="flex items-center gap-3 w-full px-4 py-3
             hover:bg-slate-700 transition"
              onClick={() => {
                handleClearChat();
                setShowMenu(false);
              }}
            >
              <Trash2 className="w-4 h-4" />
              Clear Chat
            </button>

            <button
              className={`flex items-center gap-3 w-full px-4 py-3 transition ${
                isSelectedUserBlocked
                  ? "hover:bg-green-600/20 text-green-400"
                  : "hover:bg-red-600/20 text-red-400"
              }`}
              onClick={async () => {
                if (isSelectedUserBlocked) {
                  await unblockUser(selectedUser._id);
                } else {
                  await blockUser(selectedUser._id);
                }

                await checkBlocked(selectedUser._id);
                setShowMenu(false);
              }}
            >
              <Ban className="w-4 h-4" />
              {isSelectedUserBlocked ? "Unblock User" : "Block User"}
            </button>
          </div>
        )}

        <button
          onClick={() => setSelectedUser(null)}
          className="p-2 rounded-lg hover:bg-slate-700"
        >
          <XIcon className="w-5 h-5 text-slate-300" />
        </button>
      </div>
    </div>
  );
}
export default ChatHeader;
