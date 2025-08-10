import React, { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";

const IconPlus = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const IconSticker = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
    <path d="M8 10h.01M16 10h.01M8 15c1.5 1 3 1.5 4 1.5s2.5-.5 4-1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
/* Right-pointing ">" style send arrow (matches your screenshot) */
const IconSend = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    style={{ transform: "scaleX(-1)" }} // flips horizontally
  >
    <path d="M4 12l16-8-6.5 8L20 20 4 12z" fill="currentColor" />
  </svg>
);

export default function ChatWindow({ user, messages, onSend }) {
  const [text, setText] = useState("");
  const scrollerRef = useRef(null);

  const handleSend = () => {
    const t = text.trim();
    if (!t) return;
    onSend(user.wa_id, user.name, t);
    setText("");
  };

  useEffect(() => {
    const onSend = (e) => {
      const { wa_id, name, text } = e.detail;
      // delegate actual send to App via fetch event (keeps this component UI-only)
      const send = new CustomEvent("send-message-internal", { detail: { wa_id, name, text }});
      window.dispatchEvent(send);
    };
    window.addEventListener("send-message", onSend);
    return () => window.removeEventListener("send-message", onSend);
  }, []);

  useEffect(() => {
    if (scrollerRef.current) scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
  }, [messages]);

  return (
    <section className="flex-1 flex flex-col bg-[#222e35]">
      {/* Header */}
      <header className="px-4 py-3 border-b border-[#2a3942] bg-[#202c33] text-[#e9edef]">
        <div className="font-medium">{user.name}</div>
        <div className="text-xs text-[#8696a0]">{user.wa_id}</div>
      </header>

      {/* Messages panel – full width, no side gaps */}
      <div ref={scrollerRef} className="flex-1 overflow-y-auto chat-bg">
        <div className="w-full flex flex-col gap-2 py-4 px-3 md:px-6">
          {messages.map((m) => (
            <MessageBubble key={m.msg_id} msg={m} />
          ))}
        </div>
      </div>

      {/* Composer */}
      <footer className="px-3 py-3 bg-[#202c33] border-t border-[#2a3942] flex items-center gap-2">
        <button className="p-2 rounded-full text-[#8696a0] hover:text-white hover:bg-[#2a3942] transition" title="Add">
          <IconPlus />
        </button>
        <button className="p-2 rounded-full text-[#8696a0] hover:text-white hover:bg-[#2a3942] transition" title="Stickers">
          <IconSticker />
        </button>

        <div className="flex-1">
          <input
            className="w-full bg-[#2a3942] text-[#e9edef] placeholder-[#8696a0] rounded-lg px-4 py-2"
            placeholder="Type a message"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
        </div>

        <button
          onClick={handleSend}
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: "#25D366", color: "#ffffff" }}
          title="Send"
        >
          <IconSend />
        </button>
      </footer>
    </section>
  );
}
