import { getImages } from "@/lib/actions";
import AlbumView from "./AlbumView";

import type { ApiErrorResponse, ImageDetails } from "@/definitions/definitions";

const isApiError = (value: ImageDetails[] | ApiErrorResponse | null): value is ApiErrorResponse | null =>
  value == null || !Array.isArray(value);

const AlbumPage = async ({ params }: { params: Promise<{ album: string[] }> }) => {
  const albumPath = decodeURIComponent((await params).album.join("/"));
  const response = await getImages(albumPath);

  if (isApiError(response)) {
    throw new Error(response?.message ?? "There was a problem retrieving the album.");
  }

  return <AlbumView albumPath={albumPath} images={response} />;
};

export default AlbumPage;
