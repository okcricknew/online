export default function Header() {
  return (
    <div className="sticky top-0 z-50 bg-gray-100 pb-2">
      {/* Blue Header Section */}
      <div className="bg-[#18a4e0] text-white shadow-md rounded-b-[30px] pb-5">
        
        {/* Top Header Row (Menu, Logo, Wallet, Notification) */}
        <div className="flex justify-between items-center px-4 pt-2.5 pb-1">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">☰</span>

            <h1 className="text-3xl font-black">
              Laksh
              <span className="text-gray-200">
                365
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-black rounded-full px-3 py-1.5 text-lg font-bold flex items-center gap-1.5 shadow-inner">
              <span className="text-sm">👛</span> ₹0.00
            </div>

            <div className="w-9 h-9 bg-black rounded-full flex items-center justify-center shadow-inner text-sm">
              🔔
            </div>
          </div>
        </div>

        {/* Scrolling Welcome Text */}
        <div className="px-3 py-0.5 overflow-hidden whitespace-nowrap font-bold text-xs bg-black/10">
          WELCOME TO LAKSH365, ARISE, AWAKE AND STOP NOT UNTIL THE GOAL IS ACHIEVED
        </div>

        {/* Starline and Jackpot Buttons */}
        <div className="grid grid-cols-2 gap-2.5 px-4 pt-2.5">
          <button className="bg-white text-black border-2 border-black rounded-[20px] py-2 font-black text-lg shadow-md">
            ▶ STARLINE
          </button>

          <button className="bg-white text-black border-2 border-black rounded-[20px] py-2 font-black text-lg shadow-md">
            ▶ JACKPOT
          </button>
        </div>
      </div>

      {/* Action Buttons Box (Compact Height, Attached & Overlapping) */}
      <div className="px-4 -mt-5 relative z-10">
        <div className="bg-white border-2 border-black rounded-[20px] py-2.5 px-2 flex justify-around shadow-xl">
          
          <div className="flex flex-col items-center">
            <div className="w-11 h-11 rounded-full border-2 border-black bg-white flex items-center justify-center text-xl shadow-sm">
              💰
            </div>
            <span className="font-bold mt-0.5 text-[11px] text-black">DEPOSIT</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-11 h-11 rounded-full border-2 border-black bg-white flex items-center justify-center text-xl shadow-sm">
              🏧
            </div>
            <span className="font-bold mt-0.5 text-[11px] text-black">WITHDRAW</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-11 h-11 rounded-full border-2 border-black bg-white flex items-center justify-center text-xl shadow-sm">
              🟢
            </div>
            <span className="font-bold mt-0.5 text-[11px] text-black">WHATSAPP</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-11 h-11 rounded-full border-2 border-black bg-white flex items-center justify-center text-xl shadow-sm">
              📺
            </div>
            <span className="font-bold mt-0.5 text-[11px] text-black">LIVE CHAT</span>
          </div>

        </div>
      </div>
    </div>
  );
}
