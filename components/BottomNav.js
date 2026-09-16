export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 shadow-lg max-w-xl mx-auto">
      <div className="flex flex-col items-center text-gray-500 text-xs cursor-pointer">
        <span>📄</span>
        <span>My Bids</span>
      </div>
      <div className="flex flex-col items-center text-gray-500 text-xs cursor-pointer">
        <span>📑</span>
        <span>Passbook</span>
      </div>
      <div className="flex flex-col items-center text-[#0086cb] text-xs cursor-pointer font-bold">
        <span>🏠</span>
        <span>Home</span>
      </div>
      <div className="flex flex-col items-center text-gray-500 text-xs cursor-pointer">
        <span>👛</span>
        <span>Fund</span>
      </div>
      <div className="flex flex-col items-center text-gray-500 text-xs cursor-pointer">
        <span>💬</span>
        <span>Chat</span>
      </div>
    </nav>
  );
}

