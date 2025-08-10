// App.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
// FIX: remove duplicate socket creation in this file.
// import { io } from "socket.io-client";            // ❌ not needed here
// import { SOCKET_URL } from "./api";               // ❌ not needed here
import { API_BASE } from "./api";                   // ✅ keep API base
import { socket } from "./socket";                  // ✅ use the singleton socket instance
import ChatList from "./components/ChatList";
import ChatWindow from "./components/ChatWindow";
import laptopImg from "./assets/laptop.png";

// (Optional) one-time axios baseURL setup for cleaner calls
axios.defaults.baseURL = API_BASE;

function EmptyRightPane() {
  return (
    <div className="hidden md:flex flex-1 items-center justify-center bg-[#f0f2f5]">
      <div className="text-center max-w-xl px-6">
        <img
          src={laptopImg}
          alt="WhatsApp desktop"
          className="mx-auto mb-6 w-[320px] h-auto object-contain select-none pointer-events-none"
          draggable="false"
        />
        <h2 className="text-2xl font-semibold text-[#111b21] mb-2">
          Download WhatsApp for Windows
        </h2>
        <p className="text-[#667781] mb-6">
          Make calls, share your screen and get a faster experience when you download the Windows app.
        </p>
        <button
          className="px-6 py-2 rounded-full text-white"
          style={{ backgroundColor: "#25D366" }}
        >
          Download
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    // FIX: add try/catch so UI doesn't crash if API fails (e.g., bad envs)
    (async () => {
      try {
        // With axios.defaults.baseURL set, we can use relative path:
        const res = await axios.get("/api/messages");
        setMessages(res.data || []);
      } catch (err) {
        console.error("Failed to load messages:", err?.message || err);
        setMessages([]); // keep the UI stable even if request fails
      }
    })();

    // FIX: use the singleton socket instance from ./socket
    const onNewMessage = (m) => setMessages((prev) => [...prev, m]);
    const onStatusUpdated = (u) =>
      setMessages((prev) => prev.map((m) => (m.msg_id === u.msg_id ? u : m)));

    socket.on("newMessage", onNewMessage);
    socket.on("statusUpdated", onStatusUpdated);

    // Cleanup listeners on unmount
    return () => {
      socket.off("newMessage", onNewMessage);
      socket.off("statusUpdated", onStatusUpdated);
    };
  }, []);

  const sendMessage = async (wa_id, name, text) => {
    const timestamp = new Date().toISOString();
    const msg_id = `local_${Date.now()}`;

    try {
      // Using defaults.baseURL, no need to interpolate API_BASE every time
      await axios.post("/api/messages/insert", {
        wa_id,
        name,
        text,
        timestamp,
        msg_id,
      });
    } catch (err) {
      console.error("Failed to send message:", err?.message || err);
      // Optionally show a toast/error state here
    }
  };

  const grouped = useMemo(() => {
    const users = [...new Set(messages.map((m) => m.wa_id))];
    const rows = users.map((wa_id) => ({
      wa_id,
      name: messages.find((m) => m.wa_id === wa_id)?.name || "Unknown",
      messages: messages
        .filter((m) => m.wa_id === wa_id)
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)),
    }));

    if (!query.trim()) return rows;
    const q = query.toLowerCase();
    return rows.filter(
      (r) =>
        r.wa_id.toLowerCase().includes(q) ||
        (r.name || "").toLowerCase().includes(q) ||
        (r.messages.at(-1)?.text || "").toLowerCase().includes(q)
    );
  }, [messages, query]);

  return (
    <div className="flex h-screen bg-[#111b21]">
      <ChatList
        chats={grouped}
        selectedUser={selectedUser}
        onSelect={setSelectedUser}
        query={query}
        setQuery={setQuery}
      />
      {selectedUser ? (
        <ChatWindow
          user={selectedUser}
          messages={
            grouped.find((c) => c.wa_id === selectedUser.wa_id)?.messages || []
          }
          onSend={sendMessage}
        />
      ) : (
        <EmptyRightPane />
      )}
    </div>
  );
}
