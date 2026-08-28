// true after hydration, false during SSR. Use this when the UI depends on
// browser-only state (e.g. next-themes) so the server HTML can match the
// first client paint. Not a "has this component mounted" animation flag.

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => undefined;

const useIsClient = () => useSyncExternalStore(emptySubscribe, () => true, () => false);

export default useIsClient;