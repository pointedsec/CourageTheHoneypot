import type { Metadata } from "next";
import "./globals.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import ToastProvider from "./components/ToastContainer";
import { Suspense } from "react";
export const metadata: Metadata = {
  title: "CourageTheHoneypot Web Interface",
  description: "Created by pointedsec with 🧡",
};

interface ToastProviderProps {
  children: React.ReactNode;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <Suspense>
          <ToastProvider>{children}</ToastProvider>
        </Suspense>
      </body>
    </html>
  );
}
