import Link from 'next/link';

import {
  login,
  register,
} from '@/app/actions/auth';

export const dynamic = 'force-dynamic';

export default async function LoginPage({
  searchParams,
}) {
  const params = await searchParams;

  const registerMode =
    params?.mode === 'register';

  const error = params?.error;

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">

        <h1 className="text-2xl font-bold text-center mb-6">
          LAKSH365
        </h1>

        <div className="flex mb-6 border-b">
          <Link
            href="/login"
            className={`flex-1 text-center py-3 font-semibold ${
              !registerMode
                ? 'border-b-2 border-black'
                : ''
            }`}
          >
            LOGIN
          </Link>

          <Link
            href="/login?mode=register"
            className={`flex-1 text-center py-3 font-semibold ${
              registerMode
                ? 'border-b-2 border-black'
                : ''
            }`}
          >
            REGISTER
          </Link>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 text-red-600 p-3 text-sm">
            {error}
          </div>
        )}

        {!registerMode ? (
          <form action={login} className="space-y-4">

            <input
              name="mobile"
              type="tel"
              placeholder="Mobile Number"
              required
              className="w-full border rounded-lg p-3"
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              className="w-full border rounded-lg p-3"
            />

            <button
              type="submit"
              className="w-full rounded-lg bg-black text-white p-3 font-semibold"
            >
              LOGIN
            </button>

          </form>
        ) : (
          <form action={register} className="space-y-4">

            <input
              name="fullName"
              type="text"
              placeholder="Full Name"
              required
              className="w-full border rounded-lg p-3"
            />

            <input
              name="username"
              type="text"
              placeholder="Username"
              required
              className="w-full border rounded-lg p-3"
            />

            <input
              name="mobile"
              type="tel"
              placeholder="Mobile Number"
              required
              className="w-full border rounded-lg p-3"
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              className="w-full border rounded-lg p-3"
            />

            <button
              type="submit"
              className="w-full rounded-lg bg-black text-white p-3 font-semibold"
            >
              CREATE ACCOUNT
            </button>

          </form>
        )}

      </div>
    </main>
  );
}
