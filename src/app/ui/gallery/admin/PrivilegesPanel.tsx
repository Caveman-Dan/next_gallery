"use client";

import { useEffect, useState } from "react";
import AnimatedComponent, { useAnimatedComponent } from "@/ui/components/AnimatedComponent/AnimatedComponent";
import Select from "@/ui/components/Select/Select";
import { adminSetUserProfile, adminSetUserRole } from "@/lib/serverActions";
import type { AccessProfileOption, AdminUserListItem } from "@/lib/db/dbUsers";
import styles from "./PrivilegesPanel.module.scss";

const isLastAdmin = (users: AdminUserListItem[], userId: number) => {
  const target = users.find((user) => user.id === userId);
  if (!target || target.role !== "admin") return false;
  return users.filter((user) => user.role === "admin").length <= 1;
};

const PrivilegesPanel = ({
  selected,
  profiles,
  users,
}: {
  selected: AdminUserListItem | null;
  profiles: AccessProfileOption[];
  users: AdminUserListItem[];
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
    <AnimatedComponent className={styles.root} fill={false}>
      {!displayed ? (
        <p className={styles.empty}>Select a user.</p>
      ) : (
        <>
          <div className={styles.userNameContainer}>
            <p>
              {displayed.firstName} {displayed.lastName}
              {pending ? " — pending" : ""}
            </p>
            <div className={styles.roleSelect}>
              <Select
                value={displayed.role}
                overlayText="Role"
                onChange={(role) => {
                  if (role === displayed.role) return;
                  if (role === "user" && isLastAdmin(users, displayed.id)) {
                    window.alert("There must be at least one admin.");
                    return;
                  }
                  const formData = new FormData();
                  formData.set("userId", String(displayed.id));
                  formData.set("role", role);
                  adminSetUserRole(formData);
                }}
              >
                <div data-value="user">User</div>
                <div data-value="admin">Admin</div>
              </Select>
            </div>
          </div>
          <div className={styles.profilesContainer}>
            <div className={styles.profilesCaption}>User Access Profiles</div>
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
                        {profile.name}
                        {profile.isPublic ? " (public)" : ""}
                        <input
                          type="checkbox"
                          checked={granted}
                          disabled={pending}
                          onChange={(event) => event.currentTarget.form?.requestSubmit()}
                        />
                      </label>
                    </form>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
    </AnimatedComponent>
  );
};

export default PrivilegesPanel;
