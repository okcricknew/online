import React from 'react';

export default function Header() {
  return (
    // The main container for the entire header
    <div className="sticky top-0 z-50 bg-[#18a4e0] text-white shadow-md rounded-b-[30px] overflow-hidden">
      
      {/* The system status bar area is rendered outside of this component's control, 
          but we ensure our app content is positioned correctly below it. 
          We add top padding to create space from the system status bar. */}
      <div className="h-8" /> {/* Placeholder for system status bar */}

      {/* Main Header Row (Logo, Wallet, Notifications) */}
      <div className="flex justify-between items-center px-4 pb-4">
        <div className="flex items-center gap-3">
          {/* Menu Icon */}
          <span className="text-3xl">☰</span>

          {/* Laksh 365 Logo with Crown */}
          <h1 className="text-4xl font-black relative">
            <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-base">Crown Icon</span> {/* Placeholder for crown icon */}
            Laksh
            <span className="text-gray-100">
              365
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Wallet Balance */}
          <div className="bg-black rounded-full px-4 py-2 text-xl font-bold flex items-center gap-2">
            <span className="text-base">Wallet Icon</span> {/* Placeholder for wallet icon */}
            ₹0.00
          </div>

          {/* Notification Bell */}
          <div className="w-11 h-11 bg-black rounded-full flex items-center justify-center">
            🔔
          </div>
        </div>
      </div>

      {/* Scrolling Welcome Text */}
      <div className="px-4 pb-3 overflow-hidden whitespace-nowrap font-semibold text-lg bg-white/10">
        WELCOME TO LAKSH365, ARISE, AWAKE AND STOP NOT UNTIL THE GOAL IS ACHIEVED
      </div>

      {/* Starline and Jackpot Buttons */}
      <div className="grid grid-cols-2 gap-3 px-4 py-4">
        <button className="bg-white text-black border-2 border-black rounded-[24px] py-3 font-black text-2xl flex items-center justify-center gap-2">
          ▶ STARLINE
        </button>

        <button className="bg-white text-black border-2 border-black rounded-[24px] py-3 font-black text-2xl flex items-center justify-center gap-2">
          ▶ JACKPOT
        </button>
      </div>
    </div>
  );
}
