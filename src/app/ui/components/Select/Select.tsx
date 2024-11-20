import React from "react";

import styles from "./Select.module.scss";

type SelectProps = {
  children: React.ReactNode[];
  value: string;
  onChange: (value: string) => void;
};

const Select: React.FC<SelectProps> = ({ children, value, onChange }) => {
  return (
    <select className={styles.root} value={value} onChange={(event) => onChange(event.target.value)}>
      {...children}
    </select>
  );
};

export default Select;
