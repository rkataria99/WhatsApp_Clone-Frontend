import React from "react";

const statusToTicks = (status) => {
  if (status === "read") return "✓✓";
  if (status === "delivered") return "✓✓";
  return "✓";
};

export default function MessageBubble({ msg }) {
  const isMine = msg.msg_id?.startsWith("local_");
  const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const mineBg = "#d9fdd3";
  const otherBg = "#ffffff";

  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className="max-w-[75%] px-3 py-2 rounded-lg shadow"
        style={{
          background: isMine ? mineBg : otherBg,
          borderTopLeftRadius: isMine ? "8px" : "0.25rem",
          borderTopRightRadius: isMine ? "0.25rem" : "8px",
        }}
      >
        <div className="whitespace-pre-wrap break-words text-[15px] text-[#111b21] leading-[1.25rem]">
          {msg.text}
        </div>
        <div className="mt-1 flex items-center gap-1 text-[11px] text-[#667781] justify-end">
          <span>{time}</span>
          <span className={`${msg.status === "read" ? "text-blue-600" : "text-[#667781]"}`}>
            {statusToTicks(msg.status)}
          </span>
        </div>
      </div>
    </div>
  );
}
