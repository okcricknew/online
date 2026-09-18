function Item({ icon, title }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 rounded-full border-2 border-black bg-white flex items-center justify-center text-3xl">
        {icon}
      </div>

      <span className="font-bold mt-2 text-[14px]">
        {title}
      </span>
    </div>
  );
}

export default function ActionButtons() {
  return (
    <div className="px-4 -mt-2">
      <div className="bg-white border-2 border-black rounded-[20px] py-5 px-2 flex justify-around">
        <Item icon="💰" title="DEPOSIT" />
        <Item icon="🏧" title="WITHDRAW" />
        <Item icon="🟢" title="WHATSAPP" />
        <Item icon="📺" title="LIVE CHAT" />
      </div>
    </div>
  );
}
