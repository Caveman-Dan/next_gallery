"use client";

import { useEffect, useState } from "react";
import AnimatedComponent, { useAnimatedComponent } from "@/ui/components/AnimatedComponent/AnimatedComponent";
import Accordion from "@/ui/components/Accordion/Accordion";
import ProfileAlbumLeaf from "./ProfileAlbumLeaf";
import ProfileAlbumGrant from "./ProfileAlbumGrant";
import { relativeAlbumPath } from "@/lib/profileAlbumPaths";
import { adminSetProfilePublic } from "@/lib/serverActions";
import type { AccessProfileOption } from "@/lib/db/dbUsers";
import type { DirectoryTree } from "directory-tree";
import styles from "./ProfileAlbumsPanel.module.scss";

const ProfileAlbumsPanel = ({ selected, albums }: { selected: AccessProfileOption | null; albums?: DirectoryTree }) => {
  const { hide, show } = useAnimatedComponent();
  const [held, setHeld] = useState(selected);
  const [albumPaths, setAlbumPaths] = useState(selected?.albumPaths ?? []);
  const [isPublic, setIsPublic] = useState(selected?.isPublic ?? false);
  const displayed = held?.id === selected?.id ? selected : held;
  const profile = displayed ? { ...displayed, albumPaths, isPublic } : null;

  useEffect(() => {
    if (held?.id === selected?.id) return;
    hide(() => {
      setHeld(selected);
      setAlbumPaths(selected?.albumPaths ?? []);
      setIsPublic(selected?.isPublic ?? false);
      show();
    });
  }, [held?.id, hide, selected, show]);

  return (
    <AnimatedComponent className={styles.root} fill={false}>
      {!profile || !albums ? (
        <p className={styles.empty}>{albums ? "Select a profile." : "No albums loaded."}</p>
      ) : (
        <>
          <div className={styles.header}>
            <span className={styles.caption}>Profile</span>
            <span className={styles.caption}>Public</span>
            <p className={styles.name}>{profile.name}</p>
            <form className={styles.publicForm}>
              <label>
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(event) => {
                    const nextPublic = event.currentTarget.checked;
                    setIsPublic(nextPublic);
                    const formData = new FormData();
                    formData.set("accessProfileId", String(profile.id));
                    formData.set("isPublic", nextPublic ? "true" : "false");
                    void adminSetProfilePublic(formData).then((result) => {
                      if (!result.ok) setIsPublic(!nextPublic);
                    });
                  }}
                />
              </label>
            </form>
          </div>
          <div className={styles.accordion}>
            <Accordion
              albums={albums}
              showExpandControls
              renderLeaf={(leafProps) => (
                <ProfileAlbumLeaf
                  {...leafProps}
                  profile={profile}
                  albums={albums}
                  rootPath={albums.path}
                  onAlbumPathsChange={setAlbumPaths}
                />
              )}
              renderFolderLabel={({ entry }) => (
                <ProfileAlbumGrant
                  profile={profile}
                  albumPath={relativeAlbumPath(entry.path, albums.path)}
                  albums={albums}
                  rootPath={albums.path}
                  onAlbumPathsChange={setAlbumPaths}
                />
              )}
            />
          </div>
        </>
      )}
    </AnimatedComponent>
  );
};

export default ProfileAlbumsPanel;
