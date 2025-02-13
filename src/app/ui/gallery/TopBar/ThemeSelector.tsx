import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";

import Select from "@/ui/components/Select/Select";
import { ThemeSelectorSkeleton } from "./ThemeSelectorSkeleton";

import styles from "./ThemeSelector.module.scss";

const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className={styles.root}>
      {isMounted ? (
        <>
          <Select value={theme || "system"} onChange={setTheme} overlayText="Theme">
            <div data-value="light">Light</div>
            <div data-value="dark">Dark</div>
            <div data-value="system">System</div>
          </Select>
        </>
      ) : (
        <>
          <ThemeSelectorSkeleton />
        </>
      )}
    </div>
  );
};

export default ThemeSelector;
