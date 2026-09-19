"use client";

import { useLayoutEffect, useRef } from "react";
import { adminReplaceProfileAlbums } from "@/lib/serverActions";
import { nextAlbumPaths } from "@/lib/profileAlbumPaths";
import type { AccessProfileOption } from "@/lib/db/dbUsers";
import type { DirectoryTree } from "directory-tree";
import styles from "./ProfileAlbumGrant.module.scss";

const ProfileAlbumGrant = ({
  profile,
  albumPath,
  albums,
  rootPath,
  onAlbumPathsChange,
}: {
  profile: AccessProfileOption;
  albumPath: string;
  albums: DirectoryTree;
  rootPath: string;
  onAlbumPathsChange: (albumPaths: string[]) => void;
}) => {
  const checkboxRef = useRef<HTMLInputElement>(null);
  const inDb = profile.albumPaths.includes(albumPath);
  const inherited = !inDb && profile.albumPaths.some((grant) => albumPath.startsWith(`${grant}/`));
  const partial = !inDb && !inherited && profile.albumPaths.some((grant) => grant.startsWith(`${albumPath}/`));
  const checked = inDb || inherited || partial;

  useLayoutEffect(() => {
    if (checkboxRef.current) checkboxRef.current.indeterminate = partial;
  }, [partial]);

  const handleChange = () => {
    const albumPaths = nextAlbumPaths(profile.albumPaths, albumPath, !checked, albums, rootPath);
    onAlbumPathsChange(albumPaths);
    void adminReplaceProfileAlbums(profile.id, albumPaths);
  };

  return (
    <div className={styles.root}>
      <label>
        <input
          ref={checkboxRef}
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          onClick={(event) => event.stopPropagation()}
        />
      </label>
    </div>
  );
};

export default ProfileAlbumGrant;
