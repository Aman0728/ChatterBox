import { useChatStore } from "../store/useChatStore";
import { useGroupStore } from "../store/useGroupStore";
import ChatContainer from "./ChatContainer";
import GroupChatContainer from "./GroupChatContainer";
import NoConversationPlaceholder from "./NoConversationPlaceholder";

function ContainerUltimate() {
    const { selectedUser } = useChatStore();
    const { selectedGroup } = useGroupStore();

    if (selectedUser) return <ChatContainer />;
    if (selectedGroup) return <GroupChatContainer />;

    return <NoConversationPlaceholder />;
}

export default ContainerUltimate;