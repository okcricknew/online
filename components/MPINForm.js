import { verifyMpin } from '@/app/actions/auth';

export default function MPINForm({
  error,
}) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">

      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6">

        <div className="text-center">

          <div className="text-4xl mb-3">
            🔒
          </div>

          <h1 className="text-2xl font-bold">
            App Locked
          </h1>

          <p className="text-center text-gray-500 mt-2 mb-6">
            Enter your 4 digit MPIN to continue
          </p>

        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 text-red-600 p-3 text-sm text-center">
            {error}
          </div>
        )}

        <form action={verifyMpin}>

          <input
            name="mpin"
            type="text"
            inputMode="numeric"
            pattern="[0-9]{4}"
            maxLength={4}
            minLength={4}
            autoFocus
            autoComplete="off"
            placeholder="••••"
            required
            style={{ WebkitTextSecurity: 'disc' }}
            className="w-full border-2 border-gray-300 rounded-lg p-4 text-center text-2xl tracking-[0.5em]"
          />

          <button
            type="submit"
            className="w-full mt-5 rounded-lg bg-black text-white p-3 font-semibold"
          >
            UNLOCK
          </button>

        </form>

        <p className="text-center text-xs text-gray-400 mt-5">
          Your account is already logged in.
        </p>

      </div>

    </main>
  );
}
