import { Users, LogOut, Trash2, Crown, UserRoundX, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useGroupStore } from "../store/useGroupStore";

function GroupHeader() {
  const {
    selectedGroup,
    setSelectedGroup,
    kickMember,
    leaveGroup,
    dissolveGroup,
    getGroupMembers,
    groupMembers
  } = useGroupStore();

  const { authUser } = useAuthStore();

  const [showMembers, setShowMembers] = useState(false);

  const isAdmin = selectedGroup.admin === authUser._id;

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        if (showMembers) setShowMembers(false);
        else setSelectedGroup(null);
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [showMembers, setSelectedGroup]);

  return (
    <>
      <div className="flex justify-between items-center bg-slate-800/50 border-b border-slate-700/50 px-6 h-[84px]">

        <div>
          <h3 className="text-xl font-semibold text-white">
            {selectedGroup.name}
          </h3>

          <p className="text-sm text-slate-400">
            {groupMembers.length} members
          </p>
        </div>

        <div className="flex items-center gap-2">

          <button
            onClick={() => {
                setShowMembers(true)}}
            className="btn btn-sm btn-ghost"
            title="Members"
          >
            <Users size={20} />
          </button>

          {authUser._id !== selectedGroup.admin && (
            <button
            onClick={() => leaveGroup(selectedGroup._id)}
            className="btn btn-sm btn-ghost text-warning"
            title="Leave Group"
          >
            <LogOut size={20} />
          </button>)}

          {isAdmin && (
            <button
              onClick={() => dissolveGroup(selectedGroup._id)}
              className="btn btn-sm btn-ghost text-error"
              title="Dissolve Group"
            >
              <Trash2 size={20} />
            </button>
          )}

          <button
            onClick={() => setSelectedGroup(null)}
            className="btn btn-sm btn-circle btn-ghost"
          >
            <X />
          </button>

        </div>
      </div>

      {showMembers && (
        <dialog className="modal modal-open">

          <div className="modal-box bg-slate-900">

            <div className="flex justify-between items-center mb-5">

              <h3 className="font-bold text-xl">
                Members ({selectedGroup.members.length})
              </h3>

              <button
                className="btn btn-circle btn-sm btn-ghost"
                onClick={() => setShowMembers(false)}
              >
                <X />
              </button>

            </div>

            <div className="space-y-3">

              {groupMembers.map((member) => {

                const memberIsAdmin =
                  member._id === selectedGroup.admin;

                return (
                  <div
                    key={member._id}
                    className="flex justify-between items-center bg-slate-800 rounded-xl p-3"
                  >
                    <div className="flex items-center gap-3">

                      <div className="avatar">
                        <div className="w-12 rounded-full">
                          <img
                            src={member.profilePic || "/avatar.png"}
                          />
                        </div>
                      </div>

                      <div>

                        <div className="flex items-center gap-2">

                          <span className="font-medium">
                            {member.fullName}
                          </span>

                          {memberIsAdmin && (
                            <Crown
                              className="text-yellow-400"
                              size={16}
                            />
                          )}

                        </div>

                        <p className="text-xs text-slate-400">
                          {memberIsAdmin ? "Admin" : "Member"}
                        </p>

                      </div>

                    </div>

                    {isAdmin &&
                      member._id !== authUser._id &&
                      !memberIsAdmin && (
                        <button
                          className="btn btn-error btn-sm"
                          onClick={() =>{
                            kickMember(
                              selectedGroup._id,
                              member._id
                            )
                            setShowMembers(false)
                          }
                          }
                        >
                          <UserRoundX size={16} />
                          Kick
                        </button>
                      )}

                  </div>
                );
              })}
            </div>

          </div>

          <div
            className="modal-backdrop"
            onClick={() => setShowMembers(false)}
          />

        </dialog>
      )}
    </>
  );
}

export default GroupHeader;