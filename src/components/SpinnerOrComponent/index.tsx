import LoadingSpinner from "../LoadingSpinner";

type SpinnerOrComponentProps = {
  isLoading: boolean;
  componentRenderer: any;
};

const SpinnerOrComponent = (props: SpinnerOrComponentProps) => {
  return (
    <>{props.isLoading ? <LoadingSpinner /> : props.componentRenderer()}</>
  );
};

export default SpinnerOrComponent;
