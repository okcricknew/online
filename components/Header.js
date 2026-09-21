export default function Header() {
  return (
    <div className="w-full bg-[#18a4e0] text-white sticky top-0 z-50">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-3 py-3 w-full">
        {/* Left: Menu & Logo */}
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold cursor-pointer">☰</span>
          
          {/* Logo box */}
          <div className="flex items-center bg-white text-black px-2.5 py-1 rounded-lg shadow-md">
            <span className="text-xs mr-1">👑</span>
            <span className="font-black text-lg tracking-tight">Laksh</span>
            <span className="text-[10px] font-bold bg-black text-white px-1 py-0.5 rounded ml-1">365</span>
          </div>
        </div>

        {/* Right: Wallet & Notification */}
        <div className="flex items-center gap-2">
          {/* Wallet Pill */}
          <div className="bg-black text-white rounded-full px-3 py-1 flex items-center gap-2 text-sm font-bold shadow-inner">
            <span>₹0.00</span>
            <div className="w-5 h-5 bg-white text-black rounded-full flex items-center justify-center text-xs">
              👛
            </div>
          </div>

          {/* Notification Bell */}
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-sm shadow-inner cursor-pointer">
            🔔
          </div>
        </div>
      </div>

      {/* Marquee / Ticker Text */}
      <div className="px-3 py-1 bg-transparent text-white font-bold text-[11px] whitespace-nowrap overflow-hidden flex items-center gap-1 w-full">
        <span>📢</span>
        <span>WELCOME TO LAKSH 365, ARISE, AWAKE AND STOP NOT UNTIL THE GOAL IS ACHIEVED</span>
      </div>

      {/* Starline & Jackpot Buttons Row */}
      <div className="grid grid-cols-2 gap-3 px-3 py-3 w-full">
        <button className="bg-white text-black rounded-full py-2.5 px-4 font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform">
          <div className="w-6 h-6 bg-[#18a4e0] text-white rounded-full flex items-center justify-center text-xs">
            ▶
          </div>
          STARLINE
        </button>

        <button className="bg-white text-black rounded-full py-2.5 px-4 font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform">
          <div className="w-6 h-6 bg-[#18a4e0] text-white rounded-full flex items-center justify-center text-xs">
            ▶
          </div>
          JACKPOT
        </button>
      </div>

      {/* White Bottom Section with Deposit, Withdraw, Whatsapp, Live Chat */}
      <div className="bg-white text-black rounded-t-[24px] px-3 pt-4 pb-3 shadow-lg w-full">
        <div className="grid grid-cols-4 gap-2 text-center">
          {/* Deposit */}
          <div className="flex flex-col items-center cursor-pointer">
            <div className="w-14 h-14 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md mb-1 text-2xl">
              💰
            </div>
            <span className="text-[10px] font-black tracking-tight text-gray-800">DEPOSIT</span>
          </div>

          {/* Withdraw */}
          <div className="flex flex-col items-center cursor-pointer">
            <div className="w-14 h-14 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md mb-1 text-2xl">
              💳
            </div>
            <span className="text-[10px] font-black tracking-tight text-gray-800">WITHDRAW</span>
          </div>

          {/* WhatsApp */}
          <div className="flex flex-col items-center cursor-pointer">
            <div className="w-14 h-14 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md mb-1 text-2xl">
              🟢
            </div>
            <span className="text-[10px] font-black tracking-tight text-gray-800">WHATSAPP</span>
          </div>

          {/* Live Chat */}
          <div className="flex flex-col items-center cursor-pointer">
            <div className="w-14 h-14 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md mb-1 text-2xl">
              💬
            </div>
            <span className="text-[10px] font-black tracking-tight text-gray-800">LIVE CHAT</span>
          </div>
        </div>
      </div>
    </div>
  );
}
