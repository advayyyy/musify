import "./globals.css";

export const metadata = {
  title: "Musify — your music library",
  description: "A clean music streaming site built with Next.js and MongoDB.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
