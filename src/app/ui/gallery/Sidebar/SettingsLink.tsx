import Link from "next/link";
import SettingsIcon from "@/assets/settings-5-fill.svg";

import styles from "./SettingsLink.module.scss";

const SettingsLink = ({ onSelect }: { onSelect: () => void }) => {
  return (
    <Link className={styles.root} href={"/gallery/Settings"} onClick={() => onSelect()}>
      <h2>Settings</h2>
      <div className={styles.settingsIconContainer}>
        <SettingsIcon className={styles.icon} height="3em" />
      </div>
    </Link>
  );
};

export default SettingsLink;
