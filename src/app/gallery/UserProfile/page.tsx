import { getPrincipal } from "@/lib/db/dbAccess";
import { getUserById } from "@/lib/db/dbAuthenticate";
import { profileFormConf, passwordFormConf } from "@/ui/gallery/UserProfile/validation.conf";
import ProfileForm from "@/ui/gallery/UserProfile/ProfileForm";
import PasswordForm from "@/ui/gallery/UserProfile/PasswordForm";

const Page = async () => {
  const principal = await getPrincipal();
  if (principal.kind === "guest" || !principal.user) {
    return null;
  }

  const user = await getUserById(principal.user.userId);
  if (!user) {
    return null;
  }

  const profileInitialState = structuredClone(profileFormConf.config.initialState);
  profileInitialState.forename.value = user.firstName;
  profileInitialState.surname.value = user.lastName;
  profileInitialState.email.value = user.email;
  profileInitialState.phone.value = user.phone ?? "";

  return (
    <section>
      <h2>User profile</h2>
      {user.status === "pending" && <p>Your account is waiting for an admin to approve it.</p>}
      <p>
        Role: {user.role} · Status: {user.status}
      </p>
      <ProfileForm initialState={profileInitialState} />
      <h3>Change password</h3>
      <PasswordForm initialState={passwordFormConf.config.initialState} />
    </section>
  );
};

export default Page;
