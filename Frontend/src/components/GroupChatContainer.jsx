import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import GroupHeader from "./GroupHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
// import GroupMessageInput from "./GroupMessageInput";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";
import { useGroupStore } from "../store/useGroupStore";

function GroupChatContainer() {
  const {
    selectedGroup,
    groupMessages,
    isMessagesLoading,
    getGroupMessages,
    // subscribeToGroupMessages,
    // unsubscribeFromGroupMessages,
  } = useGroupStore();

  const { authUser } = useAuthStore();

  const messageEndRef = useRef(null);

  useEffect(() => {
    if (!selectedGroup) return;

    getGroupMessages(selectedGroup._id);
    // subscribeToGroupMessages(selectedGroup._id);

    // return () => unsubscribeFromGroupMessages();
  }, [
    selectedGroup,
    getGroupMessages,
    // subscribeToGroupMessages,
    // unsubscribeFromGroupMessages,
  ]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [groupMessages]);

  if (!selectedGroup) return null;

  return (
    <>
      <GroupHeader />

      <div className="flex-1 overflow-y-auto px-6 py-8">
        {!isMessagesLoading ? (
          groupMessages.length > 0 ? (
            <div className="max-w-3xl mx-auto space-y-6">

              {groupMessages.map((msg) => {
                const isMe = msg.senderId._id === authUser._id;

                return (
                  <div
                    key={msg._id}
                    className={`chat ${isMe ? "chat-end" : "chat-start"}`}
                  >
                    <div
                      className={`chat-bubble relative ${
                        isMe
                          ? "bg-cyan-600 text-white"
                          : "bg-slate-800 text-slate-200"
                      }`}
                    >
                      {/* Sender Name */}
                      {!isMe && (
                        <p className="text-xs font-semibold text-cyan-400 mb-1">
                          {msg.senderId.fullName}
                        </p>
                      )}

                      {msg.image && (
                        <img
                          src={msg.image}
                          alt="Shared"
                          className="rounded-lg max-h-60 object-cover mb-2"
                        />
                      )}

                      {msg.text && (
                        <p>{msg.text}</p>
                      )}

                      <div className="mt-2 text-xs opacity-70 text-right">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}

              <div ref={messageEndRef} />

            </div>
          ) : (
            <NoChatHistoryPlaceholder
              name={selectedGroup.name}
            />
          )
        ) : (
          <MessagesLoadingSkeleton />
        )}
      </div>

      <MessageInput />
    </>
  );
}

export default GroupChatContainer;