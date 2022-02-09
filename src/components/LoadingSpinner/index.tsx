import styles from "./style.module.scss";
import BounceLoader from "react-spinners/BounceLoader";

type LoadingSpinnerProps = {
  color?: string;
  size?: number;
};

const LoadingSpinner = (props: LoadingSpinnerProps) => {
  const spinnerSize = props.size || 50;
  const spinnerColor = props.color || "#5200af";
  return (
    <div className={styles.wrapper}>
      <BounceLoader color={spinnerColor} loading size={spinnerSize} />
    </div>
  );
};

export default LoadingSpinner;
