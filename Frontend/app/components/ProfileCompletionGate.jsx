"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import ProfileCompletionModal from "./auth/ProfileCompletionModal";

const SKIP_PREFIXES = ["/sign-in", "/sign-up", "/admin", "/api"];

function shouldSkip(pathname) {
  if (!pathname) return true;
  return SKIP_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/**
 * Shows a blocking profile modal for signed-in users without a DB profile.
 */
export default function ProfileCompletionGate({ children }) {
  const { isLoaded, userId } = useAuth();
  const pathname = usePathname();
  const [needsProfile, setNeedsProfile] = useState(false);
  const [checked, setChecked] = useState(false);

  const refreshProfile = useCallback(async () => {
    if (!userId) {
      setNeedsProfile(false);
      setChecked(true);
      return;
    }

    try {
      const response = await fetch("/api/profile", { cache: "no-store" });
      if (!response.ok) {
        setChecked(true);
        return;
      }
      const data = await response.json();
      setNeedsProfile(!data.complete);
    } catch {
      // ignore transient errors
    } finally {
      setChecked(true);
    }
  }, [userId]);

  useEffect(() => {
    if (!isLoaded) return;
    if (!userId || shouldSkip(pathname)) {
      setNeedsProfile(false);
      setChecked(true);
      return;
    }
    setChecked(false);
    refreshProfile();
  }, [isLoaded, userId, pathname, refreshProfile]);

  return (
    <>
      {children}
      {checked && needsProfile && !shouldSkip(pathname) ? (
        <ProfileCompletionModal
          open
          onComplete={() => {
            setNeedsProfile(false);
          }}
        />
      ) : null}
    </>
  );
}
