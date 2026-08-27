import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => undefined;

const useIsClient = () => useSyncExternalStore(emptySubscribe, () => true, () => false);

export default useIsClient;