import Link from "next/link";
import SettingsIcon from "@/assets/settings-5-fill.svg";

import styles from "./SettingsLink.module.scss";

const SettingsLink = () => {
  return (
    <Link className={styles.root} href={"/Settings"}>
      <h2>Settings</h2>
      <div className={styles.settingsIconContainer}>
        <SettingsIcon className={styles.icon} height="3em" />
      </div>
    </Link>
  );
};

export default SettingsLink;
