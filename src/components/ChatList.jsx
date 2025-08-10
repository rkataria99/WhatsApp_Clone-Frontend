import React from "react";

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" className="text-[#8696a0]">
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M20 20l-3.2-3.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export default function ChatList({ chats, selectedUser, onSelect, query, setQuery }) {
  return (
    <aside className="w-full md:w-[380px] border-r border-[#2a3942] bg-[#111b21] text-[#e9edef] flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#2a3942] flex items-center justify-between">
        <div className="text-2xl font-semibold" style={{ color: "#25D366" }}>
          WhatsApp
        </div>
        <button className="text-[#8696a0] hover:text-white transition" title="Menu">⋮</button>
      </div>

      {/* Search */}
      <div className="px-3 py-3 border-b border-[#2a3942]">
        <div className="flex items-center gap-2 bg-[#202c33] rounded-full px-3 py-2">
          <SearchIcon/>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search or start a new chat"
            className="bg-transparent text-sm placeholder-[#8696a0] flex-1"
          />
        </div>
      </div>

      {/* Chats */}
      <div className="overflow-y-auto">
        {chats.map((chat) => {
          const last = chat.messages.at(-1);
          return (
            <button
              key={chat.wa_id}
              onClick={() => onSelect(chat)}
              className={`w-full text-left px-4 py-3 flex flex-col gap-0.5 border-b border-[#2a3942] hover:bg-[#202c33] transition ${
                selectedUser?.wa_id === chat.wa_id ? "bg-[#202c33]" : ""
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="font-medium truncate">{chat.name}</div>
                <div className="text-xs text-[#8696a0] ml-2 shrink-0">
                  {last ? new Date(last.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                </div>
              </div>
              <div className="text-xs text-[#8696a0]">{chat.wa_id}</div>
              <div className="text-sm text-[#aebac1] truncate">{last?.text || ""}</div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
