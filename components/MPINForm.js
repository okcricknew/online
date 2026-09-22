import { verifyMpin } from '@/app/actions/auth';

export default function MPINForm({ error }) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6">

        <h1 className="text-2xl font-bold text-center">
          Enter MPIN
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-6">
          Enter your 4 digit MPIN to continue
        </p>

        {error && (
          <div className="mb-4 text-center text-red-600">
            {error}
          </div>
        )}

        <form action={verifyMpin}>

          <input
            name="mpin"
            type="password"
            inputMode="numeric"
            pattern="[0-9]{4}"
            maxLength={4}
            autoFocus
            required
            className="w-full border rounded-lg p-4 text-center text-2xl tracking-[0.5em]"
          />

          <button
            type="submit"
            className="w-full mt-5 rounded-lg bg-black text-white p-3 font-semibold"
          >
            UNLOCK
          </button>

        </form>

      </div>
    </main>
  );
}
