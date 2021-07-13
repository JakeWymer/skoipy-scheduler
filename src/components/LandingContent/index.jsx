import "./style.scss";

const LandingContent = (props) => {
  return (
    <div className="landing-content-wrapper">
      <img src={props.logo} />
      <div className="landing-content-text">{props.info}</div>
    </div>
  );
};
export default LandingContent;
