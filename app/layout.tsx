import type { Metadata, Viewport } from "next";
import "./globals.css";
import TimeThemeProvider from "@/components/TimeThemeProvider";

export const metadata: Metadata = {
  title: "Tour de Will – 30. Geburtstag",
  description: "Wills 30. Geburtstagsabenteuer",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-512.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Tour de Will",
  },
  openGraph: {
    title: "Tour de Will – 30. Geburtstag",
    description: "Wills 30. Geburtstagsabenteuer",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0f1923",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="font-quicksand antialiased">
        <TimeThemeProvider />
        {children}
      </body>
    </html>
  );
}
