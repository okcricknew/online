'use client';

import { useState } from 'react';
import { verifyMpin } from '@/app/actions/auth';

export default function MPINForm({ error }) {
  const [mpin, setMpin] = useState('');

  function pressNumber(number) {
    if (mpin.length >= 4) return;

    setMpin((current) => current + number);
  }

  function deleteNumber() {
    setMpin((current) => current.slice(0, -1));
  }

  function submitMpin() {
    if (mpin.length !== 4) return;

    const formData = new FormData();
    formData.set('mpin', mpin);

    verifyMpin(formData);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-lg p-6">

        {/* Heading */}
        <div className="text-center mb-7">
          <div className="text-4xl mb-3">
            🔒
          </div>

          <h1 className="text-2xl font-bold">
            App Locked
          </h1>

          <p className="text-gray-500 mt-2">
            Enter your 4 digit MPIN
          </p>
        </div>

        {/* MPIN Dots */}
        <div className="flex justify-center gap-5 mb-8">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`w-4 h-4 rounded-full border-2 ${
                index < mpin.length
                  ? 'bg-black border-black'
                  : 'bg-white border-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-lg bg-red-50 text-red-600 p-3 text-sm text-center">
            {error}
          </div>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3">

          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(
            (number) => (
              <button
                key={number}
                type="button"
                onClick={() => pressNumber(String(number))}
                className="h-16 rounded-2xl bg-gray-100 text-2xl font-semibold active:scale-95 transition-transform"
              >
                {number}
              </button>
            )
          )}

          {/* Empty */}
          <div />

          {/* Zero */}
          <button
            type="button"
            onClick={() => pressNumber('0')}
            className="h-16 rounded-2xl bg-gray-100 text-2xl font-semibold active:scale-95 transition-transform"
          >
            0
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={deleteNumber}
            className="h-16 rounded-2xl bg-gray-100 text-xl font-semibold active:scale-95 transition-transform"
          >
            ⌫
          </button>

        </div>

        {/* Unlock */}
        <button
          type="button"
          onClick={submitMpin}
          disabled={mpin.length !== 4}
          className={`w-full mt-6 rounded-2xl p-4 font-semibold text-lg transition ${
            mpin.length === 4
              ? 'bg-black text-white active:scale-[0.98]'
              : 'bg-gray-200 text-gray-400'
          }`}
        >
          UNLOCK
        </button>

      </div>
    </main>
  );
}
