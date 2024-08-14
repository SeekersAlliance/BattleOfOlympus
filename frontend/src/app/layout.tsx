import type { Metadata } from "next";
import { Titillium_Web } from "next/font/google";
import "./globals.css";
import { Provider } from "./_components/Provider";

const inter = Titillium_Web({ weight:["700"],subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Seekers Alliance",
  description: "A Web3-native TCG (trading card game) for all",
  /* openGraph: {
    title: "Seekers Alliance",
    locale: "A Web3-native TCG (trading card game) for all",
    images: [
      {
        url: "https://seekersalliance-movement.vercel.app/img/bg.jpg",
        width: 1800,
        height: 1600,
        alt: 'My custom alt',
      },
    ],
    type: "website",
  }, */
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
          <Provider>
            {children}
          </Provider>
        </body>
    </html>
  );
}
