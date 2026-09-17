"use client";

import Link from "next/link";
import UserIcon from "@/assets/user-fill.svg";
import { useAnimatedComponent } from "@/ui/components/AnimatedComponent/AnimatedComponent";
import styles from "./UserProfileLink.module.scss";

const UserProfileLink = ({ onSelect }: { onSelect?: () => void }) => {
  const { push } = useAnimatedComponent();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onSelect?.();
    push("/gallery/UserProfile");
  };

  return (
    <Link className={styles.root} href="/gallery/UserProfile" onClick={handleClick}>
      <h2>User Profile</h2>
      <div className={styles.userIconContainer}>
        <UserIcon className={styles.icon} fill="true" />
      </div>
    </Link>
  );
};

export default UserProfileLink;
