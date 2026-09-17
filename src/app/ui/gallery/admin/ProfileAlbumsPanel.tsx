"use client";

import { useEffect, useState } from "react";
import AnimatedComponent, { useAnimatedComponent } from "@/ui/components/AnimatedComponent/AnimatedComponent";
import Accordion from "@/ui/components/Accordion/Accordion";
import ProfileAlbumLeaf from "./ProfileAlbumLeaf";
import ProfileAlbumGrant, { relativeAlbumPath } from "./ProfileAlbumGrant";
import { adminSetProfilePublic } from "@/lib/serverActions";
import type { AccessProfileOption } from "@/lib/db/dbUsers";
import type { DirectoryTree } from "directory-tree";
import styles from "./ProfileAlbumsPanel.module.scss";

const ProfileAlbumsPanel = ({ selected, albums }: { selected: AccessProfileOption | null; albums?: DirectoryTree }) => {
  const { hide, show } = useAnimatedComponent();
  const [displayed, setDisplayed] = useState(selected);

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
      {!displayed || !albums ? (
        <p className={styles.empty}>{albums ? "Select a profile." : "No albums loaded."}</p>
      ) : (
        <>
          <div className={styles.header}>
            <span className={styles.caption}>Profile</span>
            <span className={styles.caption}>Public</span>
            <p className={styles.name}>{displayed.name}</p>
            <form action={adminSetProfilePublic} className={styles.publicForm}>
              <input type="hidden" name="accessProfileId" value={displayed.id} />
              <input type="hidden" name="isPublic" value={displayed.isPublic ? "false" : "true"} />
              <label>
                <input
                  type="checkbox"
                  checked={displayed.isPublic}
                  onChange={(event) => event.currentTarget.form?.requestSubmit()}
                />
              </label>
            </form>
          </div>
          <div className={styles.accordion}>
            <Accordion
              albums={albums}
              showExpandControls
              renderLeaf={(leafProps) => <ProfileAlbumLeaf {...leafProps} profile={displayed} rootPath={albums.path} />}
              renderFolderLabel={({ entry }) => (
                <ProfileAlbumGrant profile={displayed} albumPath={relativeAlbumPath(entry.path, albums.path)} />
              )}
            />
          </div>
        </>
      )}
    </AnimatedComponent>
  );
};

export default ProfileAlbumsPanel;
