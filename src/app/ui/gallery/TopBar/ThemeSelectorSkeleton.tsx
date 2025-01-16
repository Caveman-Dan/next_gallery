import DirectionalArrow from "@/ui/components/DirectionalArrow/DirectionalArrow";
import styles from "./ThemeSelectorSkeleton.module.scss";

export const ThemeSelectorSkeleton = () => (
  <>
    <div className={`${styles.root}`}>
      <div className={`${styles.selectBox}`}>
        <p>Theme</p>
        <DirectionalArrow direction={"down"} />
      </div>
    </div>
  </>
);
