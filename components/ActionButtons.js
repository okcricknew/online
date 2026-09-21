function Item({ icon, title }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-14 h-14 rounded-full border-2 border-black bg-white flex items-center justify-center text-2xl shadow-sm">
        {icon}
      </div>

      <span className="font-bold mt-1 text-[13px] text-black">
        {title}
      </span>
    </div>
  );
}

export default function ActionButtons() {
  return (
    <div className="px-4 relative z-20 -mt-6">
      <div className="bg-white border-2 border-black rounded-[24px] py-4 px-2 flex justify-around shadow-md">
        <Item icon="💰" title="DEPOSIT" />
        <Item icon="🏧" title="WITHDRAW" />
        <Item icon="🟢" title="WHATSAPP" />
        <Item icon="📺" title="LIVE CHAT" />
      </div>
    </div>
  );
}
