import { ThemeProvider } from "next-themes";
import localFont from "next/font/local";

import "@/style/globals.scss";
import styles from "./layout.module.scss";

import type { Metadata } from "next";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Next Gallery",
    default: "Next Gallery",
  },
  description: "Generated by create next app",
};

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html className={styles.root} lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} ${styles.body}`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
