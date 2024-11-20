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
          {/* <div className={styles.overlay}>Theme</div> */}
          <Select value={theme || "system"} onChange={setTheme}>
            <option value="light">Light</option>
            <option value="dark">dark</option>
            <option value="system">system</option>
          </Select>
        </>
      )}
    </div>
  );
};

export default ThemeSelector;
