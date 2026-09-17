"use client";

import { useState } from "react";
import clsx from "clsx";
import Button from "@/ui/components/Button/Button";
import { AnimatedComponentProvider } from "@/ui/components/AnimatedComponent/AnimatedComponent";
import ProfileAlbumsPanel from "./ProfileAlbumsPanel";
import ProfileRow from "./ProfileRow";
import { adminCreateProfile, adminDeleteProfile, adminRenameProfile } from "@/lib/serverActions";
import type { AccessProfileOption } from "@/lib/db/dbUsers";
import type { DirectoryTree } from "directory-tree";
import styles from "./AdminUsers.module.scss";

const isReservedProfile = (profile: AccessProfileOption) => profile.isPublic || profile.name.toLowerCase() === "public";

const AdminProfiles = ({ profiles, albums }: { profiles: AccessProfileOption[]; albums?: DirectoryTree }) => {
  const [selectedId, setSelectedId] = useState<number | null>(profiles[0]?.id ?? null);
  const [renamingId, setRenamingId] = useState<number | null>(null);
  const [exitingId, setExitingId] = useState<number | null>(null);
  const [seenIds, setSeenIds] = useState(() => new Set(profiles.map((profile) => profile.id)));
  const selected = profiles.find((profile) => profile.id === selectedId) ?? null;

  return (
    <div className={styles.root}>
      <h2>Admin - Profile Settings</h2>
      <div className={`${styles.layout} ${styles.independentCards}`}>
        <section className={styles.profilesPanel}>
          <div className={styles.listHeading}>
            <h3>Profiles</h3>
            <form action={adminCreateProfile}>
              <div className={styles.headingButton}>
                <Button type="submit">New profile</Button>
              </div>
            </form>
          </div>
          {profiles.length === 0 ? (
            <p className={styles.empty}>No profiles.</p>
          ) : (
            <ul className={styles.userList}>
              {profiles.map((profile) => {
                const isNew = !seenIds.has(profile.id);
                const renaming = renamingId === profile.id;
                const exiting = exitingId === profile.id;
                return (
                  <ProfileRow
                    key={profile.id}
                    isNew={isNew}
                    exiting={exiting}
                    onEntered={() => {
                      setSeenIds((current) => {
                        if (current.has(profile.id)) return current;
                        const next = new Set(current);
                        next.add(profile.id);
                        return next;
                      });
                    }}
                    onExited={() => {
                      const form = document.querySelector<HTMLFormElement>(`[data-delete-profile="${profile.id}"]`);
                      form?.requestSubmit();
                    }}
                  >
                    {renaming ? (
                      <form
                        className={styles.renameForm}
                        action={adminRenameProfile}
                        onSubmit={() => setRenamingId(null)}
                      >
                        <input type="hidden" name="accessProfileId" value={profile.id} />
                        <input
                          className={styles.renameInput}
                          name="name"
                          defaultValue={profile.name}
                          autoFocus
                          onBlur={(event) => event.currentTarget.form?.requestSubmit()}
                          onKeyDown={(event) => {
                            if (event.key === "Escape") setRenamingId(null);
                          }}
                        />
                      </form>
                    ) : (
                      <button
                        type="button"
                        className={clsx(styles.userButton, selectedId === profile.id && styles.isSelected)}
                        onClick={() => setSelectedId(profile.id)}
                      >
                        {profile.name}
                        <span className={styles.userMeta}>{profile.isPublic ? "Public" : "Private"}</span>
                      </button>
                    )}
                    {!isReservedProfile(profile) && !renaming && (
                      <div className={styles.profileActions}>
                        <div className={styles.headingButton}>
                          <Button type="button" onClick={() => setRenamingId(profile.id)}>
                            Rename
                          </Button>
                        </div>
                        <form
                          className={styles.deleteForm}
                          data-delete-profile={profile.id}
                          action={adminDeleteProfile}
                          onSubmit={(event) => {
                            if (exitingId === profile.id) return;
                            event.preventDefault();
                            if (!window.confirm(`Delete profile “${profile.name}”?`)) return;
                            setExitingId(profile.id);
                            if (selectedId === profile.id) setSelectedId(null);
                          }}
                        >
                          <input type="hidden" name="accessProfileId" value={profile.id} />
                          <div className={styles.headingButton}>
                            <Button type="submit">Delete</Button>
                          </div>
                        </form>
                      </div>
                    )}
                  </ProfileRow>
                );
              })}
            </ul>
          )}
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
