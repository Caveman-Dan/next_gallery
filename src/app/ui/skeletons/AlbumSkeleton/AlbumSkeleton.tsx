import styles from "./AlbumSkeleton.module.scss";
import Spinner from "@/ui/components/Spinner/Spinner";

const AlbumSkeleton = () => {
  return (
    <div className={styles.root}>
      <Spinner />
      {/* <h1>Loading...</h1> */}
    </div>
  );
};

export default AlbumSkeleton;
