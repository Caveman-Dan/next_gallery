"use client";

import { adminSetProfileAlbum } from "@/lib/serverActions";
import type { AccessProfileOption } from "@/lib/db/dbUsers";
import styles from "@/ui/components/Accordion/Accordion.module.scss";

export const relativeAlbumPath = (nodePath: string, rootPath: string) => {
  if (nodePath === rootPath) return "";
  const prefix = rootPath.endsWith("/") ? rootPath : `${rootPath}/`;
  return nodePath.startsWith(prefix) ? nodePath.slice(prefix.length) : nodePath;
};

/** True when this path is stored, covered by a parent grant, or has a granted child. */
export const pathIsGranted = (albumPath: string, grants: string[]) =>
  grants.some((grant) => grant === albumPath || albumPath.startsWith(`${grant}/`) || grant.startsWith(`${albumPath}/`));

export const nextAlbumPaths = (albumPaths: string[], albumPath: string, granted: boolean) => {
  if (granted) {
    return [...albumPaths.filter((path) => path !== albumPath && !path.startsWith(`${albumPath}/`)), albumPath];
  }
  return albumPaths.filter((path) => path !== albumPath && !path.startsWith(`${albumPath}/`));
};

const ProfileAlbumGrant = ({
  profile,
  albumPath,
  onAlbumPathsChange,
}: {
  profile: AccessProfileOption;
  albumPath: string;
  onAlbumPathsChange: (albumPaths: string[]) => void;
}) => {
  const checked = pathIsGranted(albumPath, profile.albumPaths);

  const handleChange = () => {
    const next = !checked;
    onAlbumPathsChange(nextAlbumPaths(profile.albumPaths, albumPath, next));
    const formData = new FormData();
    formData.set("accessProfileId", String(profile.id));
    formData.set("albumPath", albumPath);
    formData.set("granted", next ? "true" : "false");
    void adminSetProfileAlbum(formData);
  };

  return (
    <div className={styles.rowCheck}>
      <label>
        <input type="checkbox" checked={checked} onChange={handleChange} onClick={(event) => event.stopPropagation()} />
      </label>
    </div>
  );
};

export default ProfileAlbumGrant;
