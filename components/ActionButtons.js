export default function ActionButtons() {
  return (
    <div className="bg-[#0086cb] px-4 pb-4">
      <div className="bg-white rounded-2xl p-4 flex justify-around shadow-md">
        <div className="flex flex-col items-center text-[11px] font-bold text-gray-700 cursor-pointer">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-1 text-green-600 text-lg shadow-sm border border-green-100">
            📥
          </div>
          DEPOSIT
        </div>
        <div className="flex flex-col items-center text-[11px] font-bold text-gray-700 cursor-pointer">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-1 text-green-600 text-lg shadow-sm border border-green-100">
            💳
          </div>
          WITHDRAW
        </div>
        <div className="flex flex-col items-center text-[11px] font-bold text-gray-700 cursor-pointer">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-1 text-green-600 text-lg shadow-sm border border-green-100">
            💬
          </div>
          WHATSAPP
        </div>
        <div className="flex flex-col items-center text-[11px] font-bold text-gray-700 cursor-pointer">
          <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mb-1 text-orange-500 text-lg shadow-sm border border-orange-100">
            🎧
          </div>
          LIVE CHAT
        </div>
      </div>
    </div>
  );
}
