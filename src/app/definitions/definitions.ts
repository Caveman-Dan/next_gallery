import type { DirectoryTree } from "directory-tree";

export type InteractiveToggleProps = {
  state: boolean;
  setState: React.Dispatch<React.SetStateAction<boolean>> | ((newState: boolean) => void);
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
  md5: string | number[];
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
