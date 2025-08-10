import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { API_BASE, SOCKET_URL } from "./api";
import ChatList from "./components/ChatList";
import ChatWindow from "./components/ChatWindow";

const socket = io(SOCKET_URL);

export default function App() {
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // Initial fetch
  useEffect(() => {
    axios.get(`${API_BASE}/api/messages`).then((res) => setMessages(res.data));

    socket.on("newMessage", (m) => {
    console.log("[socket] newMessage", m.msg_id, m.status);
    setMessages((prev) => [...prev, m]);
  });
    socket.on("statusUpdated", (u) => {
    console.log("[socket] statusUpdated", u.msg_id, u.status);
    setMessages((prev) => prev.map((m) => (m.msg_id === u.msg_id ? u : m)));
  });

    return () => {
      socket.off("newMessage");
      socket.off("statusUpdated");
    };
  }, []);

  // Group by wa_id
  const grouped = useMemo(() => {
    const users = [...new Set(messages.map((m) => m.wa_id))];
    return users.map((wa_id) => ({
      wa_id,
      name: messages.find((m) => m.wa_id === wa_id)?.name || "Unknown",
      messages: messages.filter((m) => m.wa_id === wa_id).sort((a,b)=>new Date(a.timestamp)-new Date(b.timestamp))
    }));
  }, [messages]);

  const sendMessage = async (wa_id, name, text) => {
    const timestamp = new Date().toISOString();
    const msg_id = `local_${Date.now()}`;
    await axios.post(`${API_BASE}/api/messages/insert`, { wa_id, name, text, timestamp, msg_id });
    // real-time insert will come via socket from backend
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <ChatList
        chats={grouped}
        selectedUser={selectedUser}
        onSelect={setSelectedUser}
      />
      {selectedUser ? (
        <ChatWindow
          user={selectedUser}
          messages={grouped.find((c) => c.wa_id === selectedUser.wa_id)?.messages || []}
          onSend={sendMessage}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Select a chat to view messages
        </div>
      )}
    </div>
  );
}
