'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [isLoginTab, setIsLoginTab] = useState(true); // true = Login, false = Register
  const [step, setStep] = useState('form'); // 'form' ya 'create_mpin'

  // Form States
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    mobile: '',
    password: '',
  });
  const [mpin, setMpin] = useState(['', '', '', '']);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMpinChange = (value, index) => {
    if (isNaN(value)) return;
    let newMpin = [...mpin];
    newMpin[index] = value;
    setMpin(newMpin);

    if (value && index < 3) {
      const nextInput = document.getElementById(`reg-mpin-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Step 1: Form Submit hone par
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!isLoginTab) {
      // Agar Register hai, toh pehle details lo phir MPIN create karne ke step par bhejo
      if (!formData.fullName || !formData.username || !formData.mobile || !formData.password) {
        alert('Kripya sabhi fields bharein.');
        return;
      }
      setStep('create_mpin'); // Move to MPIN creation step
    } else {
      // Login Logic
      if (!formData.mobile || !formData.password) {
        alert('Mobile aur Password darj karein.');
        return;
      }
      // Cookie set karke app unlock screen pe bhej do
      document.cookie = "auth_token=logged_in_user; path=/; max-age=" + 60*60*24*30;
      router.push('/');
    }
  };

  // Step 2: Register ke baad MPIN save karne ka action
  const handleSaveMpinAndRegister = () => {
    const finalMpin = mpin.join('');
    if (finalMpin.length !== 4) {
      alert('Kripya pura 4-digit MPIN darj karein.');
      return;
    }
    // Database me save karne ke baad session cookie set karein
    document.cookie = "auth_token=logged_in_user; path=/; max-age=" + 60*60*24*30;
    document.cookie = `user_mpin=${finalMpin}; path=/; max-age=` + 60*60*24*30;
    
    alert('Account successfully ban gaya aur MPIN set ho gaya!');
    router.push('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#18a4e0] px-4">
      <div className="bg-white text-black p-6 rounded-[30px] shadow-2xl w-full max-w-sm border-2 border-black">
        
        <div className="text-center mb-4">
          <h1 className="text-3xl font-black">
            Laksh<span className="text-[#18a4e0]">365</span>
          </h1>
          <p className="text-gray-600 text-xs mt-1 font-semibold">
            {step === 'create_mpin' ? 'Apna 4-Digit Security MPIN Banayein' : (isLoginTab ? 'Apne account me Login karein' : 'Naya Account Register karein')}
          </p>
        </div>

        {/* Agar MPIN creation step par hai */}
        {step === 'create_mpin' ? (
          <div className="flex flex-col items-center">
            <div className="flex justify-center gap-3 my-4">
              {mpin.map((digit, index) => (
                <input
                  key={index}
                  id={`reg-mpin-${index}`}
                  type="password"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleMpinChange(e.target.value, index)}
                  className="w-12 h-12 text-center text-2xl font-bold border-2 border-black rounded-xl focus:outline-none bg-gray-50"
                />
              ))}
            </div>
            <button 
              onClick={handleSaveMpinAndRegister}
              className="w-full bg-[#18a4e0] text-white border-2 border-black rounded-full py-3 font-black text-lg shadow-md mt-2 cursor-pointer"
            >
              SAVE MPIN & CONTINUE
            </button>
          </div>
        ) : (
          /* Normal Login / Register Form */
          <>
            {/* Tabs */}
            <div className="flex border-2 border-black rounded-full overflow-hidden mb-4 bg-gray-100">
              <button 
                type="button"
                onClick={() => setIsLoginTab(true)}
                className={`w-1/2 py-2 font-bold text-sm transition-colors cursor-pointer ${isLoginTab ? 'bg-[#18a4e0] text-white' : 'text-black'}`}
              >
                LOGIN
              </button>
              <button 
                type="button"
                onClick={() => setIsLoginTab(false)}
                className={`w-1/2 py-2 font-bold text-sm transition-colors cursor-pointer ${!isLoginTab ? 'bg-[#18a4e0] text-white' : 'text-black'}`}
              >
                REGISTER
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="flex flex-col gap-3">
              {!isLoginTab && (
                <>
                  <div>
                    <label className="block text-[11px] font-bold mb-0.5">FULL NAME</label>
                    <input 
                      type="text" 
                      name="fullName" 
                      value={formData.fullName} 
                      onChange={handleChange}
                      placeholder="Enter full name" 
                      className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-semibold bg-gray-50 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold mb-0.5">USER NAME</label>
                    <input 
                      type="text" 
                      name="username" 
                      value={formData.username} 
                      onChange={handleChange}
                      placeholder="Choose a username" 
                      className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-semibold bg-gray-50 outline-none"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-[11px] font-bold mb-0.5">MOBILE NUMBER</label>
                <input 
                  type="tel" 
                  name="mobile" 
                  value={formData.mobile} 
                  onChange={handleChange}
                  required 
                  placeholder="10 digit mobile number" 
                  className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-semibold bg-gray-50 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold mb-0.5">PASSWORD</label>
                <input 
                  type="password" 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange}
                  required 
                  placeholder="Enter password" 
                  className="w-full px-3 py-2 border-2 border-black rounded-xl text-xs font-semibold bg-gray-50 outline-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-[#18a4e0] text-white border-2 border-black rounded-full py-3 font-black text-base shadow-md mt-2 cursor-pointer active:scale-95 transition-transform"
              >
                {isLoginTab ? 'LOGIN' : 'NEXT: CREATE MPIN'}
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
}

