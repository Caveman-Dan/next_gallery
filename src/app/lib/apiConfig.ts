export const apiConfig = {
  API_TIMEOUT_MS: 15_000,
  ALBUMS_REVALIDATE_SECONDS: false, // false for no revalidation, 0 to disable caching
  IMAGES_REVALIDATE_SECONDS: false,  // false for no revalidation, 0 to disable caching
  REVALIDATION_TAGS: {
    galleryData: 'galleryData',
    albums: 'albums', 
    albumPrefix: 'album:'
  },
 } as const;

 export const { API_TIMEOUT_MS, ALBUMS_REVALIDATE_SECONDS, IMAGES_REVALIDATE_SECONDS, REVALIDATION_TAGS } = apiConfig;
