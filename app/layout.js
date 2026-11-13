import './globals.css';

export const metadata = {
  title: 'PixelForge Studio — Mobile Design Editor',
  description: 'Create, edit, save and export mobile-first graphic designs.',
  applicationName: 'PixelForge Studio',
  manifest: '/manifest.json',
  themeColor: '#0b1020',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
