import React from "react";
import { useTheme } from "next-themes";

import Select from "@/ui/Select/Select";

// import styles from "./ThemeSelector.module.scss";

const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();

  return (
    <Select value={theme || "system"} onChange={setTheme}>
      <option value="light">Light</option>
      <option value="dark">dark</option>
      <option value="system">system</option>
    </Select>
  );
};

export default ThemeSelector;
