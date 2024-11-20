import React from "react";

import styles from "./Button.module.scss";

const Button = ({ children }: { children: React.ReactNode }) => <button className={styles.root}>{children}</button>;

export default Button;
