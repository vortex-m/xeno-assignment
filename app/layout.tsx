import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DataGuard — Transaction Validator",
  description: "Upload, map, and validate transaction CSV data.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg font-sans text-text antialiased">
        {children}
      </body>
    </html>
  );
}
