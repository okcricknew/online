import './globals.css';

export const metadata = {
  title: 'Laksh 365 Clone',
  description: 'Next.js SSR with Firebase',
};

// Yeh mobile browser ke status bar aur toolbar ko color dega
export const viewport = {
  themeColor: '#0ea5e9', // App ke header ke hisab se color code yahan dalein
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
