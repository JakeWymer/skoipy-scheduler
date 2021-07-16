import MoonLoader from "react-spinners/MoonLoader";
import styles from "./style.module.scss";

type LoadingSpinnerProps = {
  color?: string;
};

const LoadingSpinner = (props: LoadingSpinnerProps) => {
  return (
    <div className={styles.wrapper}>
      <MoonLoader color={props.color || "#3a405a"} loading size={50} />
    </div>
  );
};

export default LoadingSpinner;
