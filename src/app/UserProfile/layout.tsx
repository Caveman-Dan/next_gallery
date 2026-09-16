import { redirect } from "next/navigation";
import { getPrincipal } from "@/lib/db/dbAccess";

const UserProfileLayout = async ({ children }: { children: React.ReactNode }) => {
  const principal = await getPrincipal();
  if (principal.kind === "guest") {
    redirect("/login");
  }
  return children;
};

export default UserProfileLayout;
