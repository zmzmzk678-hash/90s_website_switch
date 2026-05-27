import '../styles/globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Retro Web Reconstruct System',
  description: 'Convert modern layout architectures into 90s vintage interfaces built via DeepSeek Agent engines.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-900 text-slate-100 font-mono antialiased selection:bg-teal-500 selection:text-slate-900">
        {children}
      </body>
    </html>
  );
}