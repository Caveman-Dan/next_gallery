"use client";

import { useEffect, useState } from "react";
import AnimatedComponent, { useAnimatedComponent } from "@/ui/components/AnimatedComponent/AnimatedComponent";
import Accordion from "@/ui/components/Accordion/Accordion";
import ProfileAlbumLeaf from "./ProfileAlbumLeaf";
import ProfileAlbumGrant, { relativeAlbumPath } from "./ProfileAlbumGrant";
import type { AccessProfileOption } from "@/lib/db/dbUsers";
import type { DirectoryTree } from "directory-tree";
import styles from "./PrivilegesPanel.module.scss";

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
          <p>{displayed.name}</p>
          <Accordion
            albums={albums}
            showExpandControls
            renderLeaf={(leafProps) => <ProfileAlbumLeaf {...leafProps} profile={displayed} rootPath={albums.path} />}
            renderFolderLabel={({ entry }) => (
              <ProfileAlbumGrant profile={displayed} albumPath={relativeAlbumPath(entry.path, albums.path)} />
            )}
          />
        </>
      )}
    </AnimatedComponent>
  );
};

export default ProfileAlbumsPanel;
