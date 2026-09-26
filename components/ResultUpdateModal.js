'use client';

import { useEffect, useState } from 'react';
import {
  getMarketResult,
  updateMarketResult,
} from '@/app/actions/result';

function getIndiaDate() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const data = {};

  for (const part of parts) {
    if (part.type !== 'literal') {
      data[part.type] = part.value;
    }
  }

  return `${data.year}-${data.month}-${data.day}`;
}

export default function ResultUpdateModal({
  marketId,
  marketName,
  isOpen,
  onClose,
}) {
  const [dateKey, setDateKey] = useState(getIndiaDate());

  const [openPanna, setOpenPanna] = useState('');
  const [openAnk, setOpenAnk] = useState('');

  const [closeAnk, setCloseAnk] = useState('');
  const [closePanna, setClosePanna] = useState('');

  const [loading, setLoading] = useState(false);
  const [loadingResult, setLoadingResult] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    setMessage('');
    loadResult(dateKey);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !dateKey) return;

    loadResult(dateKey);
  }, [dateKey]);

  async function loadResult(selectedDate) {
    setLoadingResult(true);
    setMessage('');

    try {
      const response = await getMarketResult({
        marketId,
        dateKey: selectedDate,
      });

      if (!response?.success) {
        setMessage(response?.message || 'Unable to load result.');
        return;
      }

      const result = response.result;

      setOpenPanna(result?.openPanna || '');
      setOpenAnk(result?.openAnk || '');
      setCloseAnk(result?.closeAnk || '');
      setClosePanna(result?.closePanna || '');
    } catch (error) {
      console.error(error);
      setMessage('Unable to load result.');
    } finally {
      setLoadingResult(false);
    }
  }

  async function saveStage(stage) {
    setMessage('');

    if (stage === 'OPEN') {
      if (!/^\d{3}$/.test(openPanna)) {
        setMessage('Open Panna must be 3 digits.');
        return;
      }

      if (!/^\d$/.test(openAnk)) {
        setMessage('Open Ank must be 1 digit.');
        return;
      }
    }

    if (stage === 'CLOSE') {
      if (!/^\d$/.test(closeAnk)) {
        setMessage('Close Ank must be 1 digit.');
        return;
      }

      if (!/^\d{3}$/.test(closePanna)) {
        setMessage('Close Panna must be 3 digits.');
        return;
      }
    }

    setLoading(true);

    try {
      const response = await updateMarketResult({
        marketId,
        dateKey,
        stage,
        openPanna,
        openAnk,
        closeAnk,
        closePanna,
      });

      if (!response?.success) {
        setMessage(response?.message || 'Unable to save result.');
        return;
      }

      setMessage(response.message || 'Result saved successfully.');

      await loadResult(dateKey);
    } catch (error) {
      console.error(error);
      setMessage('Unable to save result.');
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) {
    return null;
  }

  const hasOpen =
    /^\d{3}$/.test(openPanna) &&
    /^\d$/.test(openAnk);

  const hasClose =
    /^\d$/.test(closeAnk) &&
    /^\d{3}$/.test(closePanna);

  const finalResult =
    hasOpen && hasClose
      ? `${openPanna}-${openAnk}${closeAnk}-${closePanna}`
      : '';

  const jodi =
    hasOpen && hasClose
      ? `${openAnk}${closeAnk}`
      : '';

  const fullSangam =
    hasOpen && hasClose
      ? `${openPanna}-${closePanna}`
      : '';

  const halfSangamA =
    hasOpen && hasClose
      ? `${openPanna}-${closeAnk}`
      : '';

  const halfSangamB =
    hasOpen && hasClose
      ? `${openAnk}-${closePanna}`
      : '';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-3">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div>
            <h2 className="text-base font-extrabold text-gray-900">
              Update Results
            </h2>

            <p className="text-xs font-semibold text-gray-500">
              {marketName || 'MARKET'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-lg font-bold text-gray-600"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[80vh] overflow-y-auto p-4">

          {/* Date */}
          <div className="mb-4">
            <label className="mb-1 block text-xs font-bold text-gray-600">
              RESULT DATE
            </label>

            <input
              type="date"
              value={dateKey}
              onChange={(e) => setDateKey(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm font-semibold outline-none focus:border-[#18a4e0]"
            />
          </div>

          {loadingResult && (
            <p className="mb-3 text-center text-xs font-semibold text-gray-500">
              Loading result...
            </p>
          )}

          {/* OPEN RESULT */}
          <div className="rounded-xl border border-gray-200 p-3">
            <h3 className="mb-3 text-sm font-extrabold text-gray-800">
              Stage 1 — Open Result
            </h3>

            <div className="grid grid-cols-2 gap-3">

              <div>
                <label className="mb-1 block text-[11px] font-bold text-gray-500">
                  OPEN PANNA
                </label>

                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={3}
                  value={openPanna}
                  onChange={(e) =>
                    setOpenPanna(
                      e.target.value.replace(/\D/g, '').slice(0, 3)
                    )
                  }
                  placeholder="690"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm font-bold outline-none focus:border-[#18a4e0]"
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold text-gray-500">
                  OPEN ANK
                </label>

                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={openAnk}
                  onChange={(e) =>
                    setOpenAnk(
                      e.target.value.replace(/\D/g, '').slice(0, 1)
                    )
                  }
                  placeholder="5"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm font-bold outline-none focus:border-[#18a4e0]"
                />
              </div>

            </div>

            <button
              type="button"
              disabled={loading}
              onClick={() => saveStage('OPEN')}
              className="mt-3 w-full rounded-lg bg-[#18a4e0] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Open Result'}
            </button>
          </div>

          {/* CLOSE RESULT */}
          <div className="mt-3 rounded-xl border border-gray-200 p-3">
            <h3 className="mb-3 text-sm font-extrabold text-gray-800">
              Stage 2 — Close Result
            </h3>

            <div className="grid grid-cols-2 gap-3">

              <div>
                <label className="mb-1 block text-[11px] font-bold text-gray-500">
                  CLOSE ANK
                </label>

                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={closeAnk}
                  onChange={(e) =>
                    setCloseAnk(
                      e.target.value.replace(/\D/g, '').slice(0, 1)
                    )
                  }
                  placeholder="9"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm font-bold outline-none focus:border-[#18a4e0]"
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold text-gray-500">
                  CLOSE PANNA
                </label>

                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={3}
                  value={closePanna}
                  onChange={(e) =>
                    setClosePanna(
                      e.target.value.replace(/\D/g, '').slice(0, 3)
                    )
                  }
                  placeholder="360"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm font-bold outline-none focus:border-[#18a4e0]"
                />
              </div>

            </div>

            <button
              type="button"
              disabled={loading}
              onClick={() => saveStage('CLOSE')}
              className="mt-3 w-full rounded-lg bg-[#18a4e0] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Close Result'}
            </button>
          </div>

          {/* PREVIEW */}
          <div className="mt-3 rounded-xl bg-gray-50 p-3">
            <h3 className="mb-2 text-xs font-extrabold text-gray-700">
              RESULT PREVIEW
            </h3>

            <div className="text-center">
              <p className="text-xl font-extrabold tracking-wider text-[#0284c7]">
                {finalResult || '***-**-***'}
              </p>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-center">

              <div className="rounded-lg bg-white p-2">
                <p className="text-[10px] font-bold text-gray-400">
                  JODI
                </p>
                <p className="text-sm font-extrabold text-gray-800">
                  {jodi || '--'}
                </p>
              </div>

              <div className="rounded-lg bg-white p-2">
                <p className="text-[10px] font-bold text-gray-400">
                  FULL SANGAM
                </p>
                <p className="text-sm font-extrabold text-gray-800">
                  {fullSangam || '--'}
                </p>
              </div>

              <div className="rounded-lg bg-white p-2">
                <p className="text-[10px] font-bold text-gray-400">
                  HALF SANGAM A
                </p>
                <p className="text-sm font-extrabold text-gray-800">
                  {halfSangamA || '--'}
                </p>
              </div>

              <div className="rounded-lg bg-white p-2">
                <p className="text-[10px] font-bold text-gray-400">
                  HALF SANGAM B
                </p>
                <p className="text-sm font-extrabold text-gray-800">
                  {halfSangamB || '--'}
                </p>
              </div>

            </div>
          </div>

          {/* MESSAGE */}
          {message && (
            <div className="mt-3 rounded-lg bg-gray-100 px-3 py-2 text-center text-xs font-semibold text-gray-700">
              {message}
            </div>
          )}

        </div>

      </div>
    </div>
  );
                }
