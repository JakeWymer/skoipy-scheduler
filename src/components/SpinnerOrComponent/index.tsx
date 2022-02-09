import LoadingSpinner from "../LoadingSpinner";

type SpinnerOrComponentProps = {
  isLoading: boolean;
  componentRenderer: any;
  spinnerColor?: string;
  spinnerSize?: number;
};

const SpinnerOrComponent = (props: SpinnerOrComponentProps) => {
  return (
    <>
      {props.isLoading ? (
        <LoadingSpinner
          color={props.spinnerColor || ""}
          size={props.spinnerSize}
        />
      ) : (
        props.componentRenderer()
      )}
    </>
  );
};

export default SpinnerOrComponent;
