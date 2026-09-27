'use client';

import { useEffect, useState } from 'react';
import {
getMarketResult,
updateMarketResult,
} from '@/app/actions/result';

function today() {
const p = new Intl.DateTimeFormat('en-CA', {
timeZone: 'Asia/Kolkata',
year: 'numeric',
month: '2-digit',
day: '2-digit',
}).formatToParts(new Date());

const d = {};
p.forEach(x => {
if (x.type !== 'literal') d[x.type] = x.value;
});

return "${d.year}-${d.month}-${d.day}";
}

export default function ResultUpdateModal({
marketId,
marketName,
isOpen,
onClose,
}) {
const [dateKey, setDateKey] = useState(today());
const [openPanna, setOpenPanna] = useState('');
const [openAnk, setOpenAnk] = useState('');
const [closeAnk, setCloseAnk] = useState('');
const [closePanna, setClosePanna] = useState('');
const [loading, setLoading] = useState(false);
const [message, setMessage] = useState('');

useEffect(() => {
if (isOpen) load(dateKey);
}, [isOpen, dateKey]);

async function load(date) {
if (!marketId || !date) return;

try {
  const r = await getMarketResult({
    marketId,
    dateKey: date,
  });

  if (!r?.success) {
    setMessage(r?.message || 'Unable to load result.');
    return;
  }

  const x = r.result || {};

  setOpenPanna(x.openPanna || '');
  setOpenAnk(x.openAnk || '');
  setCloseAnk(x.closeAnk || '');
  setClosePanna(x.closePanna || '');
  setMessage('');
} catch {
  setMessage('Unable to load result.');
}

}

async function save(stage) {
if (loading) return;
setMessage('');

if (!dateKey) {
  setMessage('Please select result date.');
  return;
}

if (
  stage === 'OPEN' &&
  (!/^\d{3}$/.test(openPanna) ||
    !/^\d$/.test(openAnk))
) {
  setMessage('Open Panna must be 3 digits and Open Ank 1 digit.');
  return;
}

if (
  stage === 'CLOSE' &&
  (!/^\d$/.test(closeAnk) ||
    !/^\d{3}$/.test(closePanna))
) {
  setMessage('Close Ank must be 1 digit and Close Panna 3 digits.');
  return;
}

setLoading(true);

try {
  const r = await updateMarketResult({
    marketId,
    dateKey,
    stage,
    openPanna,
    openAnk,
    closeAnk,
    closePanna,
  });

  if (!r?.success) {
    setMessage(r?.message || 'Unable to save result.');
    return;
  }

  setMessage(r.message || 'Result saved successfully.');
  await load(dateKey);
} catch {
  setMessage('Unable to save result.');
} finally {
  setLoading(false);
}

}

if (!isOpen) return null;

const open =
/^\d{3}$/.test(openPanna) &&
/^\d$/.test(openAnk);

const close =
/^\d$/.test(closeAnk) &&
/^\d{3}$/.test(closePanna);

const finalResult = open && close
? "${openPanna}-${openAnk}${closeAnk}-${closePanna}"
: '';

const jodi = open && close
? "${openAnk}${closeAnk}"
: '--';

const full = open && close
? "${openPanna}-${closePanna}"
: '--';

const halfA = open && close
? "${openPanna}-${closeAnk}"
: '--';

const halfB = open && close
? "${openAnk}-${closePanna}"
: '--';

const input = (value, set, max, placeholder) => (
<input
type="text"
inputMode="numeric"
maxLength={max}
value={value}
disabled={loading}
onChange={e =>
set(
e.target.value
.replace(/\D/g, '')
.slice(0, max)
)
}
placeholder={placeholder}
className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm font-bold outline-none focus:border-[#18a4e0] disabled:bg-gray-100"
/>
);

return (
<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-3">
<div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

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
        disabled={loading}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-lg font-bold text-gray-600"
      >
        ×
      </button>
    </div>

    <div className="max-h-[80vh] overflow-y-auto p-4">

      <label className="mb-1 block text-xs font-bold text-gray-600">
        RESULT DATE
      </label>

      <input
        type="date"
        value={dateKey}
        disabled={loading}
        onChange={e => {
          setDateKey(e.target.value);
          setMessage('');
        }}
        className="mb-4 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm font-semibold outline-none focus:border-[#18a4e0]"
      />

      {/* OPEN */}

      <div className="rounded-xl border border-gray-200 p-3">
        <h3 className="mb-3 text-sm font-extrabold text-gray-800">
          Stage 1 — Open Result
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-[11px] font-bold text-gray-500">
              OPEN PANNA
            </label>
            {input(openPanna, setOpenPanna, 3, '690')}
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-bold text-gray-500">
              OPEN ANK
            </label>
            {input(openAnk, setOpenAnk, 1, '5')}
          </div>
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={() => save('OPEN')}
          className="mt-3 w-full rounded-lg bg-[#18a4e0] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Open Result'}
        </button>
      </div>

      {/* CLOSE */}

      <div className="mt-3 rounded-xl border border-gray-200 p-3">
        <h3 className="mb-3 text-sm font-extrabold text-gray-800">
          Stage 2 — Close Result
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-[11px] font-bold text-gray-500">
              CLOSE ANK
            </label>
            {input(closeAnk, setCloseAnk, 1, '9')}
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-bold text-gray-500">
              CLOSE PANNA
            </label>
            {input(closePanna, setClosePanna, 3, '360')}
          </div>
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={() => save('CLOSE')}
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

        <p className="text-center text-xl font-extrabold tracking-wider text-[#0284c7]">
          {finalResult || '***-**-***'}
        </p>

        <div className="mt-3 grid grid-cols-2 gap-2 text-center">
          {[
            ['JODI', jodi],
            ['FULL SANGAM', full],
            ['HALF SANGAM A', halfA],
            ['HALF SANGAM B', halfB],
          ].map(([title, value]) => (
            <div
              key={title}
              className="rounded-lg bg-white p-2"
            >
              <p className="text-[10px] font-bold text-gray-400">
                {title}
              </p>
              <p className="text-sm font-extrabold text-gray-800">
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

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
