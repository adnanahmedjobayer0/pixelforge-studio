import './globals.css';

export const metadata = {
  title: 'PixelForge Studio',
  description: 'Mobile-first professional design editor',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
