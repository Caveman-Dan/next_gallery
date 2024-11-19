import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";

import styles from "./ThemeSelector.module.scss";

const ThemeSelector = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className={styles.root}>
      {isMounted && (
        <select
          value={theme || "system"}
          onChange={(event) => setTheme(event.target.value)}
        >
          <>
            <option value="light">Light</option>
            <option value="dark">dark</option>
            <option value="system">system</option>
          </>
        </select>
      )}
    </div>
  );
};

export default ThemeSelector;
