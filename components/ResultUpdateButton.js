'use client';

import { useState } from 'react';

import ResultUpdateModal from '@/components/ResultUpdateModal';

export default function ResultUpdateButton({
  marketId,
  marketName,
}) {
  const [isOpen, setIsOpen] =
    useState(false);

  if (!marketId) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={() =>
          setIsOpen(true)
        }
        className="
          w-full
          rounded-lg
          bg-[#18a4e0]
          px-4
          py-2.5
          text-sm
          font-bold
          text-white
          shadow-sm
          active:scale-[0.98]
        "
      >
        Update Results
      </button>

      <ResultUpdateModal
        marketId={marketId}
        marketName={marketName}
        isOpen={isOpen}
        onClose={() =>
          setIsOpen(false)
        }
      />
    </>
  );
}
