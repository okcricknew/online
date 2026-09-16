export default function ActionButtons() {
  return (
    <div className="bg-[#0086cb] px-4 pb-4 pt-2">
      <div className="bg-white rounded-xl p-3 flex justify-around shadow-lg">
        <div className="flex flex-col items-center text-xs font-semibold text-gray-700 cursor-pointer">
          <div className="bg-green-100 p-3 rounded-full mb-1 text-green-600">📥</div>
          DEPOSIT
        </div>
        <div className="flex flex-col items-center text-xs font-semibold text-gray-700 cursor-pointer">
          <div className="bg-green-100 p-3 rounded-full mb-1 text-green-600">📤</div>
          WITHDRAW
        </div>
        <div className="flex flex-col items-center text-xs font-semibold text-gray-700 cursor-pointer">
          <div className="bg-green-100 p-3 rounded-full mb-1 text-green-600">💬</div>
          WHATSAPP
        </div>
        <div className="flex flex-col items-center text-xs font-semibold text-gray-700 cursor-pointer">
          <div className="bg-orange-100 p-3 rounded-full mb-1 text-orange-600">🎧</div>
          LIVE CHAT
        </div>
      </div>
    </div>
  );
}

