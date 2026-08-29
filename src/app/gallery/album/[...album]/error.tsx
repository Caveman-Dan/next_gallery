"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const router = useRouter();

  useEffect(() => {
    console.error("Album error:", error.digest ?? error.message);
  }, [error]);

  return (
    <div>
      <h2>Oops!</h2>
      <h3>There was a problem retrieving the album. Check your connection and try again.</h3>
      <button
        type="button"
        onClick={() => {
          router.refresh();
          reset();
        }}
      >
        Try again
      </button>
    </div>
  );
}