"use client";

import { useState } from "react";
import clsx from "clsx";
import { AnimatedComponentProvider } from "@/ui/components/AnimatedComponent/AnimatedComponent";
import ProfileAlbumsPanel from "./ProfileAlbumsPanel";
import type { AccessProfileOption } from "@/lib/db/dbUsers";
import type { DirectoryTree } from "directory-tree";
import styles from "./AdminUsers.module.scss";

const AdminProfiles = ({ profiles, albums }: { profiles: AccessProfileOption[]; albums?: DirectoryTree }) => {
  const [selectedId, setSelectedId] = useState<number | null>(profiles[0]?.id ?? null);
  const selected = profiles.find((profile) => profile.id === selectedId) ?? null;

  return (
    <div className={styles.root}>
      <h2>Admin - Profile Settings</h2>
      <div className={styles.layout}>
        <section className={styles.list}>
          <h3>Profiles</h3>
          <div className={styles.scroll}>
            {profiles.length === 0 ? (
              <p className={styles.empty}>No profiles.</p>
            ) : (
              <ul className={styles.userList}>
                {profiles.map((profile) => (
                  <li key={profile.id} className={styles.userRow}>
                    <button
                      type="button"
                      className={clsx(styles.userButton, selectedId === profile.id && styles.isSelected)}
                      onClick={() => setSelectedId(profile.id)}
                    >
                      {profile.name}
                      <span className={styles.userMeta}>{profile.isPublic ? "Public" : "Private"}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className={styles.albumsPanel}>
          <h3>Albums</h3>
          <AnimatedComponentProvider fadeMs={400} resetOnPathname={false}>
            <ProfileAlbumsPanel selected={selected} albums={albums} />
          </AnimatedComponentProvider>
        </section>
      </div>
    </div>
  );
};

export default AdminProfiles;
