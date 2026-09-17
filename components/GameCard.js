export default function GameCard({ game }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 relative">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="font-extrabold text-base text-gray-900 tracking-wide">{game.title}</h2>
          <p className="text-red-600 font-bold text-[11px] mt-0.5 tracking-wider">{game.status || "CLOSED FOR TODAY"}</p>
        </div>
        <span className="text-[#0086cb] font-extrabold text-lg tracking-wider">{game.numbers}</span>
      </div>

      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100 text-xs">
        <div>
          <p className="text-gray-400 font-semibold text-[10px] tracking-wider">OPEN BIDS</p>
          <p className="font-extrabold text-gray-800 mt-0.5">{game.openBids}</p>
        </div>
        <div>
          <p className="text-gray-400 font-semibold text-[10px] tracking-wider">CLOSE BIDS</p>
          <p className="font-extrabold text-gray-800 mt-0.5">{game.closeBids}</p>
        </div>
        <div className="w-7 h-7 rounded-full bg-red-50 text-red-500 flex items-center justify-center font-bold text-sm border border-red-100">
          ✕
        </div>
      </div>
    </div>
  );
}
