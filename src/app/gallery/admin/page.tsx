import { listAccessProfiles, listAdminUsers } from "@/lib/db/dbUsers";
import { getGalleryData } from "@/lib/serverActions";
import { isApiErrorResponse } from "@/lib/helpers";
import AdminUsers from "@/ui/gallery/admin/AdminUsers";
import AdminProfiles from "@/ui/gallery/admin/AdminProfiles";

const Page = async () => {
  const [users, profiles, albumsResult] = await Promise.all([listAdminUsers(), listAccessProfiles(), getGalleryData()]);
  const albums = isApiErrorResponse(albumsResult) ? undefined : albumsResult;

  return (
    <>
      <AdminUsers users={users} profiles={profiles} />
      <AdminProfiles profiles={profiles} albums={albums} />
    </>
  );
};

export default Page;
