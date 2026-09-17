"use client";

import { adminSetProfileAlbum } from "@/lib/serverActions";
import type { AccessProfileOption } from "@/lib/db/dbUsers";

export const relativeAlbumPath = (nodePath: string, rootPath: string) => {
  if (nodePath === rootPath) return "";
  const prefix = rootPath.endsWith("/") ? rootPath : `${rootPath}/`;
  return nodePath.startsWith(prefix) ? nodePath.slice(prefix.length) : nodePath;
};

const ProfileAlbumGrant = ({ profile, albumPath }: { profile: AccessProfileOption; albumPath: string }) => {
  const granted = profile.albumPaths.includes(albumPath);
  return (
    <form action={adminSetProfileAlbum}>
      <input type="hidden" name="accessProfileId" value={profile.id} />
      <input type="hidden" name="albumPath" value={albumPath} />
      <input type="hidden" name="granted" value={granted ? "false" : "true"} />
      <label>
        <input
          type="checkbox"
          checked={granted}
          onChange={(event) => event.currentTarget.form?.requestSubmit()}
          onClick={(event) => event.stopPropagation()}
        />
      </label>
    </form>
  );
};

export default ProfileAlbumGrant;
