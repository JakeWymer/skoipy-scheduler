import LoadingSpinner from "../LoadingSpinner";

type SpinnerOrComponentProps = {
  isLoading: boolean;
  componentRenderer: any;
  spinnerColor?: string;
};

const SpinnerOrComponent = (props: SpinnerOrComponentProps) => {
  return (
    <>
      {props.isLoading ? (
        <LoadingSpinner color={props.spinnerColor || ""} />
      ) : (
        props.componentRenderer()
      )}
    </>
  );
};

export default SpinnerOrComponent;
