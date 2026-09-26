import './globals.css';

export const metadata = {
  title: 'Laksh 365 Clone',
  description: 'Next.js SSR with Firebase',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-dvh">
        {children}
      </body>
    </html>
  );
}
