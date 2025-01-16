import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";

import { exo2 } from "@/fonts";
import "@/style/globals.scss";
import styles from "./layout.module.scss";

export const metadata: Metadata = {
  title: {
    template: "Next Gallery | %s",
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
    <html className={`${exo2.className} ${styles.root}`} lang="en" suppressHydrationWarning>
      <body className={`${styles.body}`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
