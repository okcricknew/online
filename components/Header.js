export default function Header() {
  return (
    <header className="bg-[#0086cb] text-white p-4 flex justify-between items-center shadow-md">
      <div className="flex items-center gap-3">
        <span className="text-2xl cursor-pointer">☰</span>
        <h1 className="text-xl font-bold tracking-wider">LAKSH 365</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="bg-white text-black px-3 py-1 rounded-full font-bold text-sm flex items-center gap-1 shadow">
          <span>₹0.00</span>
          <span className="bg-gray-200 rounded-full p-1">👛</span>
        </div>
        <span className="text-xl cursor-pointer">🔔</span>
      </div>
    </header>
  );
}
