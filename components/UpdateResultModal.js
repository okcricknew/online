'use client';
import { useState, useActionState } from 'react';
import { updateMarketResultAction } from '@/app/actions/result';

export default function UpdateResultModal({ isOpen, onClose, marketId, marketName }) {
  const boundAction = updateMarketResultAction.bind(null, marketId);
  const [state, formAction, isPending] = useActionState(boundAction, null);

  const [openAnk, setOpenAnk] = useState('');
  const [closeAnk, setCloseAnk] = useState('');
  const [openPanna, setOpenPanna] = useState('');
  const [closePanna, setClosePanna] = useState('');

  if (!isOpen) return null;

  // Live preview calculation (UI ke liye)
  const tempJodi = `${openAnk}${closeAnk}`;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Update Result: {marketName}</h2>
        
        {state?.success && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg text-sm">
            {state.message}
          </div>
        )}

        {state?.success === false && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg text-sm">
            {state.message}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Historical Date</label>
            <input 
              type="date" 
              name="date" 
              defaultValue={new Date().toISOString().split('T')[0]} 
              className="w-full border rounded-lg p-2 text-black bg-gray-50"
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">1st Phase: Open Panna</label>
              <input 
                type="text" 
                name="openPanna" 
                placeholder="690" 
                maxLength={3}
                value={openPanna}
                onChange={(e) => setOpenPanna(e.target.value)}
                className="w-full border rounded-lg p-2 text-black"
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Open Ank</label>
              <input 
                type="text" 
                name="openAnk" 
                placeholder="5" 
                maxLength={1}
                value={openAnk}
                onChange={(e) => setOpenAnk(e.target.value)}
                className="w-full border rounded-lg p-2 text-black"
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">2nd Phase: Close Ank</label>
              <input 
                type="text" 
                name="closeAnk" 
                placeholder="9" 
                maxLength={1}
                value={closeAnk}
                onChange={(e) => setCloseAnk(e.target.value)}
                className="w-full border rounded-lg p-2 text-black"
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Close Panna</label>
              <input 
                type="text" 
                name="closePanna" 
                placeholder="360" 
                maxLength={3}
                value={closePanna}
                onChange={(e) => setClosePanna(e.target.value)}
                className="w-full border rounded-lg p-2 text-black"
                required 
              />
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 space-y-1 text-sm text-blue-900">
            <p><strong>Estimated Jodi:</strong> {tempJodi || '--'}</p>
            <p className="text-xs text-gray-600">Full Sangam & Half Sangams server par calculate hokar save honge.</p>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300 font-medium"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
            >
              {isPending ? 'Saving...' : 'Save Result'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
                  }
