"use client";

import { capitalise } from "@/lib/helpers";
import { adminSetProfileAlbum } from "@/lib/serverActions";
import type { AccordionLeafProps } from "@/ui/components/Accordion/types";
import type { AccessProfileOption } from "@/lib/db/dbUsers";
import styles from "@/ui/components/Accordion/Accordion.module.scss";

const relativePath = (nodePath: string, rootPath: string) => {
  if (nodePath === rootPath) return "";
  const prefix = rootPath.endsWith("/") ? rootPath : `${rootPath}/`;
  return nodePath.startsWith(prefix) ? nodePath.slice(prefix.length) : nodePath;
};

const ProfileAlbumLeaf = ({
  entry,
  isRootItem,
  profile,
  rootPath,
}: AccordionLeafProps & { profile: AccessProfileOption; rootPath: string }) => {
  const albumPath = relativePath(entry.path, rootPath);
  const granted = profile.albumPaths.includes(albumPath);

  return (
    <form action={adminSetProfileAlbum} className={`${styles.link}${isRootItem ? " baseItem" : ""}`}>
      <input type="hidden" name="accessProfileId" value={profile.id} />
      <input type="hidden" name="albumPath" value={albumPath} />
      <input type="hidden" name="granted" value={granted ? "false" : "true"} />
      <label>
        <input type="checkbox" checked={granted} onChange={(event) => event.currentTarget.form?.requestSubmit()} />
        {capitalise(entry.name)}
      </label>
    </form>
  );
};

export default ProfileAlbumLeaf;
