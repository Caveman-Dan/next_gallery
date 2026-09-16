import React from "react";
import { notFound } from "next/navigation";
import { getPrincipal } from "@/lib/db/dbAccess";

const AdminLayout: React.FC<{ children: React.ReactNode }> = async ({ children }: { children: React.ReactNode }) => {
  const principal = await getPrincipal();
  if (principal.kind !== "admin") {
    notFound();
  }
  return children;
};

export default AdminLayout;
