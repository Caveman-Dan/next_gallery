"use client";

import Link from "next/link";

import { useAnimatedComponent } from "@/ui/components/AnimatedComponent/AnimatedComponent";
import Image from "@/ui/components/Image/Image";

import styles from "./AlbumIndex.module.scss";

export type AlbumCover = {
  path: string;
  name: string;
  href: string;
  parent: string;
  src?: string;
  blurData?: string;
};

const AlbumTile = ({ album }: { album: AlbumCover }) => {
  const { push } = useAnimatedComponent();

  return (
    <Link
      className={styles.tile}
      href={album.href}
      onClick={(event) => {
        event.preventDefault();
        push(album.href);
      }}
    >
      <span className={styles.cover}>
        {album.src ? (
          <Image src={album.src} alt="" fill sizes="(max-width: 768px) 50vw, 16rem" blurDataURL={album.blurData} />
        ) : (
          <span className={styles.noCover}>No pictures yet</span>
        )}
      </span>
      <span className={styles.name}>{album.name}</span>
      {album.parent ? <span className={styles.parent}>{album.parent}</span> : null}
    </Link>
  );
};

const AlbumIndex = ({ albums }: { albums: AlbumCover[] }) => {
  if (!albums.length) {
    return null;
  }

  return (
    <ul className={styles.grid}>
      {albums.map((album) => (
        <li key={album.path}>
          <AlbumTile album={album} />
        </li>
      ))}
    </ul>
  );
};

export default AlbumIndex;
