export type InteractiveToggleProps = {
  state: boolean;
  setState: React.Dispatch<React.SetStateAction<boolean>> | (() => void);
};
