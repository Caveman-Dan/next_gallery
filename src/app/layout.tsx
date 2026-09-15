import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";

import { getPrincipal } from "@/lib/db/dbAccess";
import { PrincipalProvider } from "@/ui/auth/PrincipalProvider";

import { exo2 } from "@/fonts";
import "@/style/globals.scss";
import styles from "./layout.module.scss";

export const metadata: Metadata = {
  title: {
    template: `${process.env.GALLERY_NAME} | %s`,
    default: process.env.GALLERY_NAME || "",
  },
  description: "Created by Dan Marston (2025)",
};

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const principal = await getPrincipal();

  return (
    <html className={`${exo2.className} ${styles.root}`} lang="en" suppressHydrationWarning>
      <body className={`${styles.body}`}>
        <ThemeProvider>
          <PrincipalProvider principal={principal}>{children}</PrincipalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
