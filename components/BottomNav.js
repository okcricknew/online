export default function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-md">
      <div className="max-w-xl mx-auto flex justify-between items-center px-6 py-2">
        
        {/* My Bids */}
        <div className="flex flex-col items-center cursor-pointer text-gray-400 hover:text-sky-500">
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-[10px] font-medium tracking-tight">My Bids</span>
        </div>

        {/* Passbook */}
        <div className="flex flex-col items-center cursor-pointer text-gray-400 hover:text-sky-500">
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
          <span className="text-[10px] font-medium tracking-tight">Passbook</span>
        </div>

        {/* Home (Center & Active) */}
        <div className="flex flex-col items-center cursor-pointer text-sky-500">
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span className="text-[10px] font-semibold tracking-tight">Home</span>
        </div>

        {/* Fund */}
        <div className="flex flex-col items-center cursor-pointer text-gray-400 hover:text-sky-500">
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          <span className="text-[10px] font-medium tracking-tight">Fund</span>
        </div>

        {/* Chat */}
        <div className="flex flex-col items-center cursor-pointer text-gray-400 hover:text-sky-500">
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="text-[10px] font-medium tracking-tight">Chat</span>
        </div>

      </div>
    </div>
  );
}
