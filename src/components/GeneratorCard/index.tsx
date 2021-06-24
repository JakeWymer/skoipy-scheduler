import axios from "axios";
import { Generator } from "../../pages/Dashboard/types";
import Button from "../Button";
import "./style.scss";

export type GeneratorCardProps = {
  generator: Generator;
};

const GeneratorCard = (props: GeneratorCardProps) => {
  const generatePlaylist = async () => {
    console.log(`Generate Playlist for id: ${props.generator.id}`);
    await axios.post(`/generators/${props.generator.id}/generate`);
  };
  return (
    <div className="generator-card-wrapper">
      <h3 className="generator-card-title">{props.generator.name}</h3>
      <div className="generator-card-buttons">
        <Button text="Generate Playlist" clickHandler={generatePlaylist} />
      </div>
    </div>
  );
};

export default GeneratorCard;
