import styles from "./ClickAway.module.scss";

const ClickAway = ({ active, setActive }) => (
  <div className={`${styles.clickAway} ${!active ? styles.hide : ""}`} onClick={() => setActive(false)} />
);

export default ClickAway;
