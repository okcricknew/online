export default function GameCard({ game }) {
  const isOpen =
    game.isOpen ||
    game.status?.toLowerCase().includes("running");

  return (
    <div className="bg-white border-2 border-black rounded-[22px] p-4 relative">
      <div className="flex justify-between">
        <div>
          <h2 className="text-[22px] font-black uppercase">
            {game.title}
          </h2>

          <p
            className={`font-bold text-[16px] mt-1 ${
              isOpen ? "text-green-600" : "text-red-600"
            }`}
          >
            {isOpen
              ? "RUNNING FOR OPEN"
              : "CLOSED FOR TODAY"}
          </p>
        </div>

        <div className="text-[#3aa6e8] font-black text-[18px]">
          {game.numbers || "***-**-***"}
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <div>
          <p className="text-[14px]">OPEN BIDS</p>
          <p className="font-black text-[18px]">
            {game.openBids}
          </p>
        </div>

        <div>
          <p className="text-[14px]">CLOSE BIDS</p>
          <p className="font-black text-[18px]">
            {game.closeBids}
          </p>
        </div>

        <div
          className={`w-14 h-14 rounded-full border-2 flex items-center justify-center text-3xl font-black ${
            isOpen
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {isOpen ? "✓" : "✕"}
        </div>
      </div>
    </div>
  );
}
