import { getPrincipal } from "@/lib/db/dbAccess";
import { getUserById } from "@/lib/db/dbAuthenticate";

const Page = async () => {
  const principal = await getPrincipal();
  if (principal.kind === "guest" || !principal.user) {
    return null;
  }

  const user = await getUserById(principal.user.userId);
  if (!user) {
    return null;
  }

  return (
    <section>
      <h2>User profile</h2>
      {user.status === "pending" && <p>Your account is waiting for an admin to approve it.</p>}
      <dl>
        <dt>Email</dt>
        <dd>{user.email}</dd>
        <dt>Name</dt>
        <dd>
          {user.firstName} {user.lastName}
        </dd>
        <dt>Phone</dt>
        <dd>{user.phone || "—"}</dd>
        <dt>Role</dt>
        <dd>{user.role}</dd>
        <dt>Status</dt>
        <dd>{user.status}</dd>
      </dl>
    </section>
  );
};

export default Page;
