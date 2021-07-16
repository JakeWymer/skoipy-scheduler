import axios from "axios";
import { Generator } from "../../pages/Dashboard/types";
import Button from "../Button";
import { ButtonTheme } from "../Button/types";
import style from "./style.module.scss";

export type GeneratorCardProps = {
  generator: Generator;
};

const GeneratorCard = (props: GeneratorCardProps) => {
  const generatePlaylist = async () => {
    await axios.post(`/generators/${props.generator.id}/generate`);
  };
  return (
    <div className={style.generator_card_wrapper}>
      <h3 className={style.generator_card_title}>{props.generator.name}</h3>
      <div className={style.generator_card_buttons}>
        <Button
          text="Generate Playlist"
          theme={ButtonTheme.GREEN}
          clickHandler={generatePlaylist}
        />
      </div>
    </div>
  );
};

export default GeneratorCard;
