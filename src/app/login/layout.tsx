import { redirect } from "next/navigation";
import { getPrincipal } from "@/lib/db/dbAccess";

const LoginLayout = async ({ children }: { children: React.ReactNode }) => {
  const principal = await getPrincipal();
  if (principal.kind !== "guest") {
    redirect("/gallery");
  }
  return children;
};

export default LoginLayout;
