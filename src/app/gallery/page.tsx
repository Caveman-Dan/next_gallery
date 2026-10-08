import { getAllowedAlbumPaths } from "@/lib/db/dbAccess";
import { albumPathAllowed } from "@/lib/albumAccess";
import { getGalleryData, getImages } from "@/lib/serverActions";
import { isApiErrorResponse } from "@/lib/helpers";
import { listAlbumNodes } from "@/lib/albumAccess";

import AlbumIndex, { type AlbumCover } from "@/ui/gallery/AlbumIndex/AlbumIndex";

import styles from "./page.module.scss";

const GalleryPage = async () => {
  const tree = await getGalleryData();

  if (isApiErrorResponse(tree)) {
    return (
      <div className={styles.root}>
        <h1 className={styles.heading}>Albums</h1>
        <p className={styles.empty}>{tree.message ?? "The album list could not be loaded."}</p>
      </div>
    );
  }

  const access = await getAllowedAlbumPaths();
  const albums = listAlbumNodes(tree).filter((album) => albumPathAllowed(album.path, access));
  const covers = await Promise.all(
    albums.map(async (album): Promise<AlbumCover> => {
      const images = await getImages(album.path);
      const first = !isApiErrorResponse(images) && images.length ? images[0] : undefined;
      const parts = album.path.split("/");
      const category = parts[0];
      const parent = parts.length > 2 ? parts.slice(1, -1).join(" / ") : "";

      return {
        path: album.path,
        name: album.name,
        href: `/gallery/album/${parts.map(encodeURIComponent).join("/")}`,
        parent,
        category,
        src: first?.src,
        blurData: first?.placeholder?.blurData,
      };
    })
  );

  return (
    <div className={styles.root}>
      <h1 className={styles.heading}>Albums</h1>
      {covers.length ? (
        <AlbumIndex albums={covers} />
      ) : (
        <p className={styles.empty}>No albums to show yet. An admin can grant some from the access profiles.</p>
      )}
    </div>
  );
};

export default GalleryPage;
