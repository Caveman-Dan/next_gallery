import { getImages } from "@/lib/actions";
import AlbumView from "./AlbumView";

import { isApiErrorResponse } from "@/lib/helpers";

const AlbumPage = async ({ params }: { params: Promise<{ album: string[] }> }) => {
  const albumPath = decodeURIComponent((await params).album.join("/"));
  const response = await getImages(albumPath);

  if (isApiErrorResponse(response) || !Array.isArray(response)) {
    throw new Error("There was a problem retrieving the album.");
  }

  return <AlbumView albumPath={albumPath} images={response} />;
};

export default AlbumPage;

