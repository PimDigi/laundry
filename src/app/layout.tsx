import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lavora POS & Laundry",
  description: "Aplikasi POS & Manajemen Laundry",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <div className="min-h-screen bg-slate-900 flex justify-center items-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-slate-50 min-h-screen relative shadow-2xl pb-20 flex flex-col overflow-hidden">
            <ClientLayout>{children}</ClientLayout>
          </div>
        </div>
      </body>
    </html>
  );
}
