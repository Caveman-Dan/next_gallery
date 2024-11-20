import React, { useEffect, useState } from "react";

import styles from "./Select.module.scss";

type SelectProps = {
  children: React.ReactNode[];
  value: string;
  onChange: (value: string) => void;
};

const Select: React.FC<SelectProps> = ({ children, value, onChange }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className={styles.root}>
      {isMounted && (
        <select value={value} onChange={(event) => onChange(event.target.value)}>
          {...children}
        </select>
      )}
    </div>
  );
};

export default Select;
