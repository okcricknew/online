'use client';

import { useState, useEffect } from 'react';
import Header from './Header';
import MarketList from './MarketList';
import BottomNav from './BottomNav';

export default function MainDashboard() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pin, setPin] = useState(['', '', '', '']);

  useEffect(() => {
    // Check karein ki kya session me pehle se unlocked hai
    const unlockedSession = sessionStorage.getItem('app_unlocked');
    if (unlockedSession === 'true') {
      setIsUnlocked(true);
    }
  }, []);

  const handleChange = (value, index) => {
    if (isNaN(value)) return;
    let newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    if (value && index < 3) {
      const nextInput = document.getElementById(`mpin-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleUnlock = () => {
    const enteredPin = pin.join('');
    if (enteredPin.length !== 4) {
      alert('Kripya pura 4-digit MPIN darj karein.');
      return;
    }

    // Yahan aap saved MPIN ke sath verify kar sakte hain
    sessionStorage.setItem('app_unlocked', 'true');
    setIsUnlocked(true);
  };

  // Agar MPIN unlock nahi hua hai, toh lock screen dikhao
  if (!isUnlocked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="bg-white text-black p-6 rounded-[30px] shadow-2xl w-full max-w-sm text-center border-2 border-black">
          <div className="w-16 h-16 bg-[#18a4e0] text-white rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border-2 border-black">
            🔒
          </div>
          
          <h2 className="text-2xl font-black mb-1">ENTER MPIN</h2>
          <p className="text-gray-600 text-xs mb-6 font-medium">
            App secure hai. Apna 4-digit MPIN daalkar unlock karein.
          </p>

          <div className="flex justify-center gap-3 mb-6">
            {pin.map((digit, index) => (
              <input
                key={index}
                id={`mpin-${index}`}
                type="password"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                className="w-12 h-12 text-center text-2xl font-bold border-2 border-black rounded-xl focus:outline-none bg-gray-50"
              />
            ))}
          </div>

          <button 
            onClick={handleUnlock}
            className="w-full bg-[#18a4e0] text-white border-2 border-black rounded-full py-3 font-black text-lg shadow-md active:scale-95 transition-transform cursor-pointer"
          >
            UNLOCK APP
          </button>
        </div>
      </div>
    );
  }

  // Unlock hone ke baad Compulsory Header, Market List aur Bottom Nav dikhega
  return (
    <div className="max-w-xl mx-auto relative min-h-screen pb-20 bg-gray-50">
      <Header />
      
      <main className="p-4 flex flex-col gap-4">
        <MarketList />
      </main>

      <BottomNav />
    </div>
  );
}

