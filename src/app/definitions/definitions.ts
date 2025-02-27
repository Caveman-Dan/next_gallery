import type { DirectoryTree } from "directory-tree";

export type InteractiveToggleProps = {
  state: boolean;
  setState: React.Dispatch<React.SetStateAction<boolean>> | (() => void);
};

export interface GetAlbumsInterface extends DirectoryTree {
  custom: {
    id: string;
  };
}
