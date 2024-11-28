import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";

import Select from "@/app/ui/components/Select/Select";

import styles from "./ThemeSelector.module.scss";

const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className={styles.root}>
      {isMounted && (
        <>
          <Select value={theme || "system"} onChange={setTheme} overlayText="Theme">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </Select>
        </>
      )}
    </div>
  );
};

export default ThemeSelector;
