"use client";

import { useState } from "react";
import clsx from "clsx";
import Button from "@/ui/components/Button/Button";
import Ripple from "@/ui/components/RippleComponent/RippleComponent";
import { AnimatedComponentProvider } from "@/ui/components/AnimatedComponent/AnimatedComponent";
import { adminDeleteUser, adminSetUserRevoked } from "@/lib/serverActions";
import PrivilegesPanel from "./PrivilegesPanel";
import type { AccessProfileOption, AdminUserListItem } from "@/lib/db/dbUsers";
import styles from "./AdminUsers.module.scss";

const AdminUsers = ({ users, profiles }: { users: AdminUserListItem[]; profiles: AccessProfileOption[] }) => {
  const [selectedId, setSelectedId] = useState<number | null>(users[0]?.id ?? null);
  const selected = users.find((user) => user.id === selectedId) ?? null;

  return (
    <div className={styles.root}>
      <h2>Admin</h2>
      <div className={styles.layout}>
        <section className={styles.list}>
          <h3>Users</h3>
          {users.length === 0 ? (
            <p className={styles.empty}>No users.</p>
          ) : (
            <ul className={styles.userList}>
              {users.map((user) => (
                <li key={user.id} className={styles.userRow}>
                  <button
                    type="button"
                    className={clsx(styles.userButton, selectedId === user.id && styles.isSelected)}
                    onClick={() => setSelectedId(user.id)}
                  >
                    {user.firstName} {user.lastName}
                    <span className={styles.userMeta}>
                      {user.email} · {user.status}
                    </span>
                    <Ripple />
                  </button>
                  <div className={styles.rowActions}>
                    <form action={adminSetUserRevoked}>
                      <input type="hidden" name="userId" value={user.id} />
                      <input type="hidden" name="pending" value={user.status === "pending" ? "false" : "true"} />
                      <label className={styles.revoke}>
                        <input
                          type="checkbox"
                          checked={user.status !== "pending"}
                          onChange={(event) => event.currentTarget.form?.requestSubmit()}
                        />
                        Privileges Active
                      </label>
                    </form>
                    <form action={adminDeleteUser}>
                      <input type="hidden" name="userId" value={user.id} />
                      <div className={styles.deleteButton}>
                        <Button type="submit">Delete</Button>
                      </div>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={styles.panel}>
          <h3>Privileges</h3>
          <AnimatedComponentProvider fadeMs={400} resetOnPathname={false}>
            <PrivilegesPanel selected={selected} profiles={profiles} />
          </AnimatedComponentProvider>
        </section>
      </div>
    </div>
  );
};

export default AdminUsers;
