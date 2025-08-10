export default function ChatList({ chats, selectedUser, onSelect }) {
  return (
    <aside className="w-full md:w-1/3 lg:w-1/4 border-r bg-white overflow-y-auto">
      <div className="p-4 font-semibold text-lg border-b">Chats</div>
      {chats.map((chat) => (
        <button
          key={chat.wa_id}
          onClick={() => onSelect(chat)}
          className={`w-full text-left px-4 py-3 border-b hover:bg-gray-100 ${
            selectedUser?.wa_id === chat.wa_id ? "bg-gray-100" : ""
          }`}
        >
          <div className="font-semibold">{chat.name}</div>
          <div className="text-sm text-gray-600">{chat.wa_id}</div>
          <div className="text-xs text-gray-500 truncate">{chat.messages.at(-1)?.text || ""}</div>
        </button>
      ))}
    </aside>
  );
}
