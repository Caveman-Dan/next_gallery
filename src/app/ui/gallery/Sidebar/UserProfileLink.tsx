import Link from "next/link";

import UserIcon from "@/assets/user-fill.svg";

import styles from "./UserProfileLink.module.scss";

const UserProfileLink = ({ onSelect }: { onSelect: () => void }) => {
  return (
    <Link className={styles.root} href={"/gallery/UserProfile"} onClick={() => onSelect()}>
      <h2>User Profile</h2>
      <div className={styles.userIconContainer}>
        <UserIcon className={styles.icon} fill="true" />
      </div>
    </Link>
  );
};

export default UserProfileLink;
