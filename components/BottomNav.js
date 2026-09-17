export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2.5 shadow-lg max-w-xl mx-auto z-50">
      <div className="flex flex-col items-center text-gray-400 text-[10px] font-medium cursor-pointer">
        <span className="text-lg mb-0.5">📄</span>
        <span>My Bids</span>
      </div>
      <div className="flex flex-col items-center text-gray-400 text-[10px] font-medium cursor-pointer">
        <span className="text-lg mb-0.5">📑</span>
        <span>Passbook</span>
      </div>
      <div className="flex flex-col items-center text-[#0086cb] text-[10px] font-bold cursor-pointer">
        <span className="text-lg mb-0.5">🏠</span>
        <span>Home</span>
      </div>
      <div className="flex flex-col items-center text-gray-400 text-[10px] font-medium cursor-pointer">
        <span className="text-lg mb-0.5">👛</span>
        <span>Fund</span>
      </div>
      <div className="flex flex-col items-center text-gray-400 text-[10px] font-medium cursor-pointer">
        <span className="text-lg mb-0.5">💬</span>
        <span>Chat</span>
      </div>
    </nav>
  );
}
