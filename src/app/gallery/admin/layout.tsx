import { notFound } from "next/navigation";
import { getPrincipal } from "@/lib/db/dbAccess";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const principal = await getPrincipal();
  if (principal.kind !== "admin") {
    notFound();
  }
  return children;
};

export default AdminLayout;
