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

export type ApiErrorResponse = {
  status?: number;
  error?: boolean;
  message?: string;
};

export type ImageDetails = {
  fileName: string;
  details: {
    height: number;
    orientation: number;
    width: number;
    type: string;
  };
  placeholder: {
    error: boolean;
    blurData: string;
  };
};
