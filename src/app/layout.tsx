import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";

export const metadata: Metadata = {
  title: "יומן תזונה",
  description: "מעקב תזונה אישי",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 min-w-0 lg:mr-56">
            <div className="p-4 md:p-6 max-w-4xl mx-auto">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
