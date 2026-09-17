"use client";

import Link from "next/link";
import AdminIcon from "@/assets/settings-5-fill.svg";
import { usePrincipal } from "@/ui/auth/PrincipalProvider";
import { useAnimatedComponent } from "@/ui/components/AnimatedComponent/AnimatedComponent";
import styles from "./AdminLink.module.scss";

const AdminLink = ({ onSelect }: { onSelect: () => void }) => {
  const principal = usePrincipal();
  const { push } = useAnimatedComponent();
  if (principal.kind !== "admin") return null;

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onSelect();
    push("/gallery/admin");
  };

  return (
    <Link className={styles.root} href={"/gallery/admin"} onClick={handleClick}>
      <h2>Admin Settings</h2>
      <div className={styles.iconContainer}>
        <AdminIcon className={styles.icon} height="3em" />
      </div>
    </Link>
  );
};

export default AdminLink;
