import { useEffect, useState } from "react";
import { Check, X, Users } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import { useGroupStore } from "../store/useGroupStore";
import { useAuthStore } from "../store/useAuthStore";

function GroupList() {
    const {authUser} = useAuthStore();
  const {
    allContacts,
    getAllContacts,
    isUsersLoading,
    setSelectedUser
  } = useChatStore();
  const {
    allGroups,
    getAllGroups,
    createGroup,
    setSelectedGroup,
    selectedGroup,
    getGroupMembers,
    groupMembers
  } = useGroupStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  useEffect(() => {
    getAllContacts();
    getAllGroups();
  }, [getAllContacts, getAllGroups]);

  const toggleMember = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((memberId) => memberId !== id)
        : [...prev, id]
    );
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) return;
    if (selectedMembers.length === 0) return;
    let name = groupName
    let members = selectedMembers
    console.log("Create Group Clicked")
    const data = new FormData();
    data.append("name", groupName)
    data.append("members", selectedMembers)
    await createGroup(name, members);

    setGroupName("");
    setSelectedMembers([]);
    setIsModalOpen(false);
  };

  if (isUsersLoading) return <UsersLoadingSkeleton />;

  return (
    <>
      {/* Create Group Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full flex items-center justify-center gap-2 rounded-lg bg-cyan-500 text-white py-3 font-semibold hover:bg-cyan-600 transition mb-4"
      >
        <Users size={18} />
        Create New Group
      </button>

      {/* Groups */}
      <div className="space-y-3">
        {allGroups?.map((group) => (
          <div
            key={group._id}
            onClick={() => {
              setSelectedGroup(group)
              setSelectedUser(null)
              getGroupMembers(group._id)
            }}
            className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition"
          >
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-full bg-cyan-600 flex items-center justify-center">
                <Users size={22} className="text-white" />
              </div>

              <div>
                <h4 className="text-slate-200 font-medium">{group.name}</h4>
                <p className="text-xs text-slate-400">
                  {group.members.length} members
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-lg bg-slate-900 border border-slate-700">

            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-xl text-white">
                Create New Group
              </h3>

              <button
                className="btn btn-sm btn-circle btn-ghost"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            {/* Group Name */}
            <input
              type="text"
              placeholder="Group Name"
              className="input input-bordered w-full mb-5"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />

            {/* Selected Members */}
            {selectedMembers.length > 0 && (
              <>
                <h4 className="font-semibold mb-2">Selected Members</h4>

                <div className="flex flex-wrap gap-2 mb-5">
                  {selectedMembers.map((id) => {
                    const contact = allContacts.find((c) => c._id === id);

                    return (
                      <div
                        key={id}
                        className="badge badge-info gap-2 py-4"
                      >
                        {contact?.fullName}

                        <button onClick={() => toggleMember(id)}>
                          <X size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            <h4 className="font-semibold mb-3">Select Members</h4>

            <div className="max-h-80 overflow-y-auto space-y-2">
              {allContacts.map((contact) => {
                const selected = selectedMembers.includes(contact._id);

                return (
                  <div
                    key={contact._id}
                    onClick={() => toggleMember(contact._id)}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition
                    ${
                      selected
                        ? "bg-cyan-500/20 border border-cyan-500"
                        : "bg-slate-800 hover:bg-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="w-10 rounded-full">
                          <img
                            src={contact.profilePic || "/avatar.png"}
                            alt={contact.fullName}
                          />
                        </div>
                      </div>

                      <span>{contact.fullName}</span>
                    </div>

                    {selected && (
                      <Check className="text-cyan-400" size={20} />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="modal-action">
              <button
                className="btn"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>

              <button
                className="btn btn-info"
                onClick={handleCreateGroup}
              >
                Create Group
              </button>
            </div>
          </div>

          <div
            className="modal-backdrop"
            onClick={() => setIsModalOpen(false)}
          />
        </dialog>
      )}
    </>
  );
}

export default GroupList;