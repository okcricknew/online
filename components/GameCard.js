export default function GameCard({ game }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow border border-gray-200">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="font-bold text-lg text-gray-900">{game.title}</h2>
          <p className="text-red-600 font-semibold text-xs mt-0.5">{game.status}</p>
        </div>
        <span className="text-[#0086cb] font-bold text-lg tracking-wide">{game.numbers}</span>
      </div>

      <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100 text-xs">
        <div>
          <p className="text-gray-500 font-medium">OPEN BIDS</p>
          <p className="font-bold text-gray-800 mt-0.5">{game.openBids}</p>
        </div>
        <div>
          <p className="text-gray-500 font-medium">CLOSE BIDS</p>
          <p className="font-bold text-gray-800 mt-0.5">{game.closeBids}</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">
          ❌
        </div>
      </div>
    </div>
  );
}

