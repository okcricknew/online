export default function Header() {
  return (
    <div className="sticky top-0 z-50">
      {/* Blue Header Section */}
      <div className="bg-[#18a4e0] text-white shadow-md rounded-b-[35px] pb-6">
        
        {/* Top Header Row (Menu, Logo, Wallet, Notification) */}
        <div className="flex justify-between items-center px-4 pt-4 pb-2">
          <div className="flex items-center gap-3">
            <span className="text-3xl">☰</span>

            <h1 className="text-4xl font-black">
              Laksh
              <span className="text-gray-200">
                365
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-black rounded-full px-4 py-2 text-xl font-bold flex items-center gap-1.5 shadow-inner">
              <span className="text-base">👛</span> ₹0.00
            </div>

            <div className="w-11 h-11 bg-black rounded-full flex items-center justify-center shadow-inner">
              🔔
            </div>
          </div>
        </div>

        {/* Scrolling Welcome Text */}
        <div className="px-3 py-1 overflow-hidden whitespace-nowrap font-bold text-sm bg-black/10">
          WELCOME TO LAKSH365, ARISE, AWAKE AND STOP NOT UNTIL THE GOAL IS ACHIEVED
        </div>

        {/* Starline and Jackpot Buttons */}
        <div className="grid grid-cols-2 gap-3 px-4 pt-4">
          <button className="bg-white text-black border-2 border-black rounded-[24px] py-2.5 font-black text-xl shadow-md">
            ▶ STARLINE
          </button>

          <button className="bg-white text-black border-2 border-black rounded-[24px] py-2.5 font-black text-xl shadow-md">
            ▶ JACKPOT
          </button>
        </div>
      </div>

      {/* Action Buttons Box (Attached & Overlapping) */}
      <div className="px-4 -mt-6 relative z-10">
        <div className="bg-white border-2 border-black rounded-[24px] py-4 px-2 flex justify-around shadow-xl">
          
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full border-2 border-black bg-white flex items-center justify-center text-2xl shadow-sm">
              💰
            </div>
            <span className="font-bold mt-1 text-[13px] text-black">DEPOSIT</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full border-2 border-black bg-white flex items-center justify-center text-2xl shadow-sm">
              🏧
            </div>
            <span className="font-bold mt-1 text-[13px] text-black">WITHDRAW</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full border-2 border-black bg-white flex items-center justify-center text-2xl shadow-sm">
              🟢
            </div>
            <span className="font-bold mt-1 text-[13px] text-black">WHATSAPP</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full border-2 border-black bg-white flex items-center justify-center text-2xl shadow-sm">
              📺
            </div>
            <span className="font-bold mt-1 text-[13px] text-black">LIVE CHAT</span>
          </div>

        </div>
      </div>
    </div>
  );
}
