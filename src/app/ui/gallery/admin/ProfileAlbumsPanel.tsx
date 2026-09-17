"use client";

import { useEffect, useState } from "react";
import AnimatedComponent, { useAnimatedComponent } from "@/ui/components/AnimatedComponent/AnimatedComponent";
import { adminSetProfileAlbum } from "@/lib/serverActions";
import type { AccessProfileOption } from "@/lib/db/dbUsers";
import type { DirectoryTree } from "directory-tree";
import styles from "./PrivilegesPanel.module.scss";

const relativePath = (nodePath: string, rootPath: string) => {
  if (nodePath === rootPath) return "";
  const prefix = rootPath.endsWith("/") ? rootPath : `${rootPath}/`;
  return nodePath.startsWith(prefix) ? nodePath.slice(prefix.length) : nodePath;
};

const AlbumNode = ({
  node,
  rootPath,
  selected,
}: {
  node: DirectoryTree;
  rootPath: string;
  selected: AccessProfileOption;
}) => {
  const [open, setOpen] = useState(false);
  const relative = relativePath(node.path, rootPath);
  const isLeaf = !node.children?.length;
  const granted = selected.albumPaths.includes(relative);

  if (isLeaf) {
    return (
      <form action={adminSetProfileAlbum}>
        <input type="hidden" name="accessProfileId" value={selected.id} />
        <input type="hidden" name="albumPath" value={relative} />
        <input type="hidden" name="granted" value={granted ? "false" : "true"} />
        <label>
          <input type="checkbox" checked={granted} onChange={(event) => event.currentTarget.form?.requestSubmit()} />
          {node.name}
        </label>
      </form>
    );
  }

  return (
    <div>
      <button type="button" onClick={() => setOpen((value) => !value)}>
        {node.name}
      </button>
      {open &&
        node.children?.map((child) => (
          <AlbumNode key={child.path} node={child} rootPath={rootPath} selected={selected} />
        ))}
    </div>
  );
};

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
          {albums.children?.map((child) => (
            <AlbumNode key={child.path} node={child} rootPath={albums.path} selected={displayed} />
          ))}
        </>
      )}
    </AnimatedComponent>
  );
};

export default ProfileAlbumsPanel;
