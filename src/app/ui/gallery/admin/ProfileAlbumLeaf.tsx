"use client";

import { capitalise } from "@/lib/helpers";
import ProfileAlbumGrant, { relativeAlbumPath } from "./ProfileAlbumGrant";
import type { AccordionLeafProps } from "@/ui/components/Accordion/types";
import type { AccessProfileOption } from "@/lib/db/dbUsers";
import styles from "@/ui/components/Accordion/Accordion.module.scss";

const ProfileAlbumLeaf = ({
  entry,
  isRootItem,
  profile,
  rootPath,
}: AccordionLeafProps & { profile: AccessProfileOption; rootPath: string }) => (
  <div className={`${styles.link}${isRootItem ? " baseItem" : ""}`}>
    <ProfileAlbumGrant profile={profile} albumPath={relativeAlbumPath(entry.path, rootPath)} />
    {capitalise(entry.name)}
  </div>
);

export default ProfileAlbumLeaf;
