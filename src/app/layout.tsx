import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-pink-100 via-white to-pink-200 min-h-screen font-sans text-gray-800">
        <main className="max-w-2xl mx-auto p-4 min-h-screen flex flex-col">
        {children}
        </main>
      </body>
    </html>
  );
}
