export default function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg">
      <div className="max-w-xl mx-auto flex justify-around items-center py-2">
        {/* My Bids */}
        <div className="flex flex-col items-center cursor-pointer text-gray-500 hover:text-sky-500">
          <svg className="w-6 h-6 mb-0.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-[11px] font-medium">My Bids</span>
        </div>

        {/* Passbook */}
        <div className="flex flex-col items-center cursor-pointer text-gray-500 hover:text-sky-500">
          <svg className="w-6 h-6 mb-0.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8m-3-3l3 3-3 3" />
          </svg>
          <span className="text-[11px] font-medium">Passbook</span>
        </div>

        {/* Home (Active) */}
        <div className="flex flex-col items-center cursor-pointer text-sky-500">
          <svg className="w-6 h-6 mb-0.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7-7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-[11px] font-semibold">Home</span>
        </div>

        {/* Fund */}
        <div className="flex flex-col items-center cursor-pointer text-gray-500 hover:text-sky-500">
          <svg className="w-6 h-6 mb-0.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12V7H3v5m18 0v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5m18 0H3m15-4a1 1 0 100-2 1 1 0 000 2z" />
          </svg>
          <span className="text-[11px] font-medium">Fund</span>
        </div>

        {/* Chat */}
        <div className="flex flex-col items-center cursor-pointer text-gray-500 hover:text-sky-500">
          <svg className="w-6 h-6 mb-0.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="text-[11px] font-medium">Chat</span>
        </div>
      </div>
    </div>
  );
          }
          
