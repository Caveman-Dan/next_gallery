"use client";

import { useState } from "react";
import clsx from "clsx";
import Button from "@/ui/components/Button/Button";
import { adminDeleteUser, adminSetUserProfile, adminSetUserRevoked } from "@/lib/serverActions";
import type { AccessProfileOption, AdminUserListItem } from "@/lib/db/dbUsers";
import styles from "./AdminUsers.module.scss";

const AdminUsers = ({ users, profiles }: { users: AdminUserListItem[]; profiles: AccessProfileOption[] }) => {
  const [selectedId, setSelectedId] = useState<number | null>(users[0]?.id ?? null);
  const selected = users.find((user) => user.id === selectedId) ?? null;
  const revoked = selected?.status === "disabled";

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
                  </button>
                  <div className={styles.rowActions}>
                    <form action={adminSetUserRevoked}>
                      <input type="hidden" name="userId" value={user.id} />
                      <input type="hidden" name="revoked" value={user.status !== "disabled" ? "true" : "false"} />
                      <label className={styles.revoke}>
                        <input
                          type="checkbox"
                          checked={user.status === "disabled"}
                          onChange={(event) => event.currentTarget.form?.requestSubmit()}
                        />
                        Revoke
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
          {!selected ? (
            <p className={styles.empty}>Select a user.</p>
          ) : (
            <>
              <p>
                {selected.firstName} {selected.lastName}
                {revoked ? " — privileges revoked" : ""}
              </p>
              <ul className={styles.profileList}>
                {profiles.map((profile) => {
                  const granted = selected.profileIds.includes(profile.id);
                  return (
                    <li key={profile.id}>
                      <form action={adminSetUserProfile}>
                        <input type="hidden" name="userId" value={selected.id} />
                        <input type="hidden" name="accessProfileId" value={profile.id} />
                        <input type="hidden" name="granted" value={granted ? "false" : "true"} />
                        <label className={styles.profileRow}>
                          <input
                            type="checkbox"
                            checked={granted}
                            disabled={revoked}
                            onChange={(event) => event.currentTarget.form?.requestSubmit()}
                          />
                          {profile.name}
                          {profile.isPublic ? " (public)" : ""}
                        </label>
                      </form>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminUsers;
