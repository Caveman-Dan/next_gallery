"use client";

import { useState } from "react";
import { adminSetProfileAlbum } from "@/lib/serverActions";
import type { AccessProfileOption } from "@/lib/db/dbUsers";
import styles from "@/ui/components/Accordion/Accordion.module.scss";

export const relativeAlbumPath = (nodePath: string, rootPath: string) => {
  if (nodePath === rootPath) return "";
  const prefix = rootPath.endsWith("/") ? rootPath : `${rootPath}/`;
  return nodePath.startsWith(prefix) ? nodePath.slice(prefix.length) : nodePath;
};

export const pathIsGranted = (albumPath: string, grants: string[]) =>
  grants.some((grant) => albumPath === grant || albumPath.startsWith(`${grant}/`));

const ProfileAlbumGrant = ({ profile, albumPath }: { profile: AccessProfileOption; albumPath: string }) => {
  const grantedFromServer = pathIsGranted(albumPath, profile.albumPaths);
  const [profileId, setProfileId] = useState(profile.id);
  const [checked, setChecked] = useState(grantedFromServer);

  if (profile.id !== profileId) {
    setProfileId(profile.id);
    setChecked(pathIsGranted(albumPath, profile.albumPaths));
  }

  const handleChange = () => {
    const next = !checked;
    setChecked(next);
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
