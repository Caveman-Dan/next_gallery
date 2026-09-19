"use client";

import { capitalise } from "@/lib/helpers";
import DirectionalArrow from "@/ui/components/DirectionalArrow/DirectionalArrow";
import ProfileAlbumGrant, { relativeAlbumPath } from "./ProfileAlbumGrant";
import type { AccordionLeafProps } from "@/ui/components/Accordion/types";
import type { AccessProfileOption } from "@/lib/db/dbUsers";
import type { DirectoryTree } from "directory-tree";
import styles from "@/ui/components/Accordion/Accordion.module.scss";

const ProfileAlbumLeaf = ({
  entry,
  isRootItem,
  profile,
  albums,
  rootPath,
  onAlbumPathsChange,
}: AccordionLeafProps & {
  profile: AccessProfileOption;
  albums: DirectoryTree;
  rootPath: string;
  onAlbumPathsChange: (albumPaths: string[]) => void;
}) => (
  <div className={`${styles.link}${isRootItem ? " baseItem" : ""}`}>
    <span className={styles.rowInner}>
      <span className={styles.rowLabel}>{capitalise(entry.name)}</span>
      <ProfileAlbumGrant
        profile={profile}
        albumPath={relativeAlbumPath(entry.path, rootPath)}
        albums={albums}
        rootPath={rootPath}
        onAlbumPathsChange={onAlbumPathsChange}
      />
      <span className={styles.rowArrow}>
        <DirectionalArrow direction="right" height="28px" colour={"var(--highlight-colour-alternate4)"} />
      </span>
    </span>
  </div>
);

export default ProfileAlbumLeaf;
