"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { animated, useSpring } from "@react-spring/web";
import AnimatedComponent, { useAnimatedComponent } from "@/ui/components/AnimatedComponent/AnimatedComponent";
import Select from "@/ui/components/Select/Select";
import useWindowSize from "@/hooks/useWindowSize";
import { adminSetUserProfile, adminSetUserRole } from "@/lib/serverActions";
import { accordion as springsConfig } from "@/style/springsConfig";
import type { AccessProfileOption, AdminUserListItem } from "@/lib/db/dbUsers";
import styles from "./PrivilegesPanel.module.scss";

const isLastAdmin = (users: AdminUserListItem[], userId: number) => {
  const target = users.find((user) => user.id === userId);
  if (!target || target.role !== "admin") return false;
  return users.filter((user) => user.role === "admin").length <= 1;
};

const PrivilegeProfileItem = ({
  exiting,
  onExited,
  children,
}: {
  exiting: boolean;
  onExited: () => void;
  children: React.ReactNode;
}) => {
  const started = useRef(false);
  const [spring, api] = useSpring(() => ({ opacity: 1, config: springsConfig }));

  useLayoutEffect(() => {
    if (!exiting || started.current) return;
    started.current = true;
    api.start({
      opacity: 0,
      onRest: ({ finished }) => {
        if (finished) onExited();
      },
    });
  }, [api, exiting, onExited]);

  return <animated.li style={spring}>{children}</animated.li>;
};

const PrivilegesPanel = ({
  selected,
  profiles,
  users,
}: {
  selected: AdminUserListItem | null;
  profiles: AccessProfileOption[];
  users: AdminUserListItem[];
}) => {
  const { hide, show } = useAnimatedComponent();
  const windowSize = useWindowSize();
  const aboveLg = windowSize.aboveLg;
  const [held, setHeld] = useState(selected);
  const [capped, setCapped] = useState(false);
  const [leaving, setLeaving] = useState<AccessProfileOption[]>([]);
  const [knownProfiles, setKnownProfiles] = useState(profiles);
  const displayed = held?.id === selected?.id ? selected : held;
  const pending = displayed?.status !== "active";
  const rootRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [boxSpring, boxApi] = useSpring(() => ({ height: 0, config: springsConfig }));
  const justRemoved = knownProfiles.filter((profile) => !profiles.some((item) => item.id === profile.id));
  if (justRemoved.length) {
    setKnownProfiles(profiles);
    setLeaving((current) => [
      ...current,
      ...justRemoved.filter((profile) => !current.some((item) => item.id === profile.id)),
    ]);
  } else if (knownProfiles.length !== profiles.length) {
    setKnownProfiles(profiles);
  }

  const visibleProfiles = [
    ...profiles,
    ...leaving.filter((profile) => !profiles.some((item) => item.id === profile.id)),
  ];

  useEffect(() => {
    if (held?.id === selected?.id) return;
    hide(() => {
      setHeld(selected);
      show();
    });
  }, [held?.id, hide, selected, show]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const header = headerRef.current;
    const measure = measureRef.current;
    if (!root || !measure) return;
    const natural = measure.scrollHeight;
    if (!aboveLg) {
      boxApi.start({
        height: natural,
        onRest: () => setCapped(false),
      });
      return;
    }
    const bottomGap = 6;
    const available = root.clientHeight - (header?.offsetHeight ?? 0) - bottomGap;
    const target = Math.max(0, Math.min(natural, available));
    boxApi.start({
      height: target,
      onRest: () => setCapped(natural > available + 1),
    });
  }, [aboveLg, boxApi, displayed, leaving, profiles]);

  return (
    <AnimatedComponent className={styles.root} fill>
      <div className={styles.fill} ref={rootRef}>
        {!displayed ? (
          <p className={styles.empty}>Select a user.</p>
        ) : (
          <>
            <div className={styles.userNameContainer} ref={headerRef}>
              <p>
                {displayed.firstName} {displayed.lastName}
                {pending ? " — pending" : ""}
              </p>
              <div className={styles.roleSelect}>
                <Select
                  value={displayed.role}
                  overlayText="Role"
                  onChange={(role) => {
                    if (role === displayed.role) return;
                    if (role === "user" && isLastAdmin(users, displayed.id)) {
                      window.alert("There must be at least one admin.");
                      return;
                    }
                    const formData = new FormData();
                    formData.set("userId", String(displayed.id));
                    formData.set("role", role);
                    adminSetUserRole(formData);
                  }}
                >
                  <div data-value="user">User</div>
                  <div data-value="admin">Admin</div>
                </Select>
              </div>
            </div>
            <animated.div
              className={`${styles.profilesContainer}${aboveLg && capped ? ` ${styles.isCapped}` : ""}`}
              style={boxSpring}
            >
              <div ref={measureRef} className={styles.profilesMeasure}>
                <div className={styles.profilesCaption}>User Access Profiles</div>
                <ul className={styles.profileList}>
                  {visibleProfiles.map((profile) => {
                    const granted = displayed.profileIds.includes(profile.id);
                    const exiting = leaving.some((item) => item.id === profile.id);
                    return (
                      <PrivilegeProfileItem
                        key={profile.id}
                        exiting={exiting}
                        onExited={() => setLeaving((current) => current.filter((item) => item.id !== profile.id))}
                      >
                        <form action={adminSetUserProfile}>
                          <input type="hidden" name="userId" value={displayed.id} />
                          <input type="hidden" name="accessProfileId" value={profile.id} />
                          <input type="hidden" name="granted" value={granted ? "false" : "true"} />
                          <label className={styles.profileRow}>
                            {profile.name}
                            {profile.isPublic ? " (public)" : ""}
                            <input
                              type="checkbox"
                              checked={granted}
                              disabled={pending}
                              onChange={(event) => event.currentTarget.form?.requestSubmit()}
                            />
                          </label>
                        </form>
                      </PrivilegeProfileItem>
                    );
                  })}
                </ul>
              </div>
            </animated.div>
          </>
        )}
      </div>
    </AnimatedComponent>
  );
};

export default PrivilegesPanel;
