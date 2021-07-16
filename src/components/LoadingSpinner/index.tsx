import MoonLoader from "react-spinners/MoonLoader";
import styles from "./style.module.scss";

const LoadingSpinner = () => {
  return (
    <div className={styles.wrapper}>
      <MoonLoader color="#3a405a" loading size={50} />
    </div>
  );
};

export default LoadingSpinner;
