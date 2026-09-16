"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import Button from "@/ui/components/Button/Button";
import Ripple from "@/ui/components/RippleComponent/RippleComponent";
import AnimatedComponent, {
  AnimatedComponentProvider,
  useAnimatedComponent,
} from "@/ui/components/AnimatedComponent/AnimatedComponent";
import { adminDeleteUser, adminSetUserProfile, adminSetUserRevoked } from "@/lib/serverActions";
import type { AccessProfileOption, AdminUserListItem } from "@/lib/db/dbUsers";
import styles from "./AdminUsers.module.scss";

const PrivilegesPanel = ({
  selected,
  profiles,
}: {
  selected: AdminUserListItem | null;
  profiles: AccessProfileOption[];
}) => {
  const { hide, show } = useAnimatedComponent();
  const [displayed, setDisplayed] = useState(selected);
  const pending = displayed?.status !== "active";

  useEffect(() => {
    if (displayed?.id === selected?.id) {
      setDisplayed(selected);
      return;
    }
    hide(() => {
      setDisplayed(selected);
      show();
    });
  }, [displayed?.id, hide, selected, show]);

  return (
    <AnimatedComponent className={styles.panelBody} fill={false}>
      {!displayed ? (
        <p className={styles.empty}>Select a user.</p>
      ) : (
        <>
          <p>
            {displayed.firstName} {displayed.lastName}
            {pending ? " — pending" : ""}
          </p>
          <ul className={styles.profileList}>
            {profiles.map((profile) => {
              const granted = displayed.profileIds.includes(profile.id);
              return (
                <li key={profile.id}>
                  <form action={adminSetUserProfile}>
                    <input type="hidden" name="userId" value={displayed.id} />
                    <input type="hidden" name="accessProfileId" value={profile.id} />
                    <input type="hidden" name="granted" value={granted ? "false" : "true"} />
                    <label className={styles.profileRow}>
                      <input
                        type="checkbox"
                        checked={granted}
                        disabled={pending}
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
    </AnimatedComponent>
  );
};

const AdminUsers = ({ users, profiles }: { users: AdminUserListItem[]; profiles: AccessProfileOption[] }) => {
  const [selectedId, setSelectedId] = useState<number | null>(users[0]?.id ?? null);
  const selected = users.find((user) => user.id === selectedId) ?? null;
  const pending = selected?.status !== "active";

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
