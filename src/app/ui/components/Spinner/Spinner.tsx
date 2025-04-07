import styles from "./Spinner.module.scss";

const Spinner = () => (
  <div className={styles.root}>
    <div className={styles.loader} />
  </div>
);

export default Spinner;
