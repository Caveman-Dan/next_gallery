import Link from "next/link";
import AdminIcon from "@/assets/settings-5-fill.svg";

import styles from "./AdminLink.module.scss";

import { usePrincipal } from "@/ui/auth/PrincipalProvider";

const AdminLink = ({ onSelect }: { onSelect: () => void }) => {
  const principal = usePrincipal();
  if (principal.kind !== "admin") return null;

  return (
    <Link className={styles.root} href={"/gallery/admin"} onClick={() => onSelect()}>
      <h2>Admin Settings</h2>{" "}
      <div className={styles.iconContainer}>
        <AdminIcon className={styles.icon} height="3em" />
      </div>
    </Link>
  );
};

export default AdminLink;
