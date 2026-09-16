import { listAccessProfiles, listAdminUsers } from "@/lib/db/dbUsers";
import AdminUsers from "@/ui/gallery/admin/AdminUsers";

const Page = async () => {
  const [users, profiles] = await Promise.all([listAdminUsers(), listAccessProfiles()]);
  return <AdminUsers users={users} profiles={profiles} />;
};

export default Page;
