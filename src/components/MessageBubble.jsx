const statusToTicks = (status) => {
  if (status === "read") return "✓✓";      // style as 'blue' via span class if you want
  if (status === "delivered") return "✓✓";
  return "✓";
};

export default function MessageBubble({ msg }) {
  const isMine = msg.msg_id?.startsWith("local_");
  const time = new Date(msg.timestamp).toLocaleString();

  return (
    <div className={`max-w-[70%] p-2 rounded-lg shadow text-sm
      ${isMine ? "ml-auto bg-green-200" : "mr-auto bg-white"}`}>
      <div>{msg.text}</div>
      <div className="flex justify-between text-[11px] text-gray-500 mt-1">
        <span>{time}</span>
        <span className={`${msg.status === "read" ? "text-blue-600" : ""}`}>
          {statusToTicks(msg.status)}
        </span>
      </div>
    </div>
  );
}
