import { useState, useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

export default function ChatWindow({ user, messages, onSend }) {
  const [text, setText] = useState("");
  const scrollerRef = useRef(null);

  const handleSend = () => {
    if (text.trim()) {
      onSend(user.wa_id, user.name, text.trim());
      setText("");
    }
  };

  // auto-scroll to bottom
  useEffect(() => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <section className="flex-1 flex flex-col">
      <header className="p-4 border-b bg-white">
        <div className="font-semibold">{user.name}</div>
        <div className="text-sm text-gray-600">{user.wa_id}</div>
      </header>

      <div ref={scrollerRef} className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
        {messages.map((m) => <MessageBubble key={m.msg_id} msg={m} />)}
      </div>

      <footer className="p-3 border-t bg-white flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2 outline-none"
          placeholder="Type a message"
          value={text}
          onChange={(e)=>setText(e.target.value)}
          onKeyDown={(e)=>{ if (e.key==='Enter') handleSend(); }}
        />
        <button
          className="px-4 py-2 bg-green-600 text-white rounded"
          onClick={handleSend}
        >
          Send
        </button>
      </footer>
    </section>
  );
}
