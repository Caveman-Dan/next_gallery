"use client";

import { useEffect, useState } from "react";
import AnimatedComponent, { useAnimatedComponent } from "@/ui/components/AnimatedComponent/AnimatedComponent";
import { adminSetUserProfile } from "@/lib/serverActions";
import type { AccessProfileOption, AdminUserListItem } from "@/lib/db/dbUsers";
import styles from "./PrivilegesPanel.module.scss";

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
    <AnimatedComponent className={styles.root} fill={false}>
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

export default PrivilegesPanel;
