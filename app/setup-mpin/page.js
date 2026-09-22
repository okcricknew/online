import { setMpin } from '@/app/actions/auth';
import MpinSetupComplete from '@/components/MpinSetupComplete';

export const dynamic = 'force-dynamic';

export default async function SetupMpinPage({
  searchParams,
}) {
  const params = searchParams || {};

  const error = params.error;

  const completed =
    params.completed === '1';

  if (completed) {
    return <MpinSetupComplete />;
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6">

        <h1 className="text-2xl font-bold text-center">
          Create MPIN
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-6">
          Create your 4 digit MPIN
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 text-red-600 p-3 text-sm text-center">
            {error}
          </div>
        )}

        <form
          action={setMpin}
          className="space-y-4"
        >

          <input
            name="mpin"
            type="password"
            inputMode="numeric"
            pattern="[0-9]{4}"
            maxLength={4}
            minLength={4}
            placeholder="Enter MPIN"
            required
            autoComplete="new-password"
            className="w-full border rounded-lg p-4 text-center text-2xl tracking-[0.5em]"
          />

          <input
            name="confirmMpin"
            type="password"
            inputMode="numeric"
            pattern="[0-9]{4}"
            maxLength={4}
            minLength={4}
            placeholder="Confirm MPIN"
            required
            autoComplete="new-password"
            className="w-full border rounded-lg p-4 text-center text-2xl tracking-[0.5em]"
          />

          <button
            type="submit"
            className="w-full rounded-lg bg-black text-white p-3 font-semibold"
          >
            SET MPIN
          </button>

        </form>

      </div>
    </main>
  );
}
