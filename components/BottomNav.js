export default function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t z-50">
      <div className="max-w-xl mx-auto flex justify-around py-3">
        <div className="text-center">
          <div>📄</div>
          <div>My Bids</div>
        </div>

        <div className="text-center">
          <div>🔄</div>
          <div>Passbook</div>
        </div>

        <div className="text-center text-sky-500 font-bold">
          <div>🏠</div>
          <div>Home</div>
        </div>

        <div className="text-center">
          <div>👛</div>
          <div>Fund</div>
        </div>

        <div className="text-center">
          <div>💬</div>
          <div>Chat</div>
        </div>
      </div>
    </div>
  );
}
