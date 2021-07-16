import axios from "axios";
import { Link } from "react-router-dom";
import { Generator } from "../../pages/Dashboard/types";
import Button from "../Button";
import { ButtonTheme } from "../Button/types";
import EditIcon from "./assets/edit.svg";
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
      <Link
        to={{
          pathname: `/generator/${props.generator.id}/edit`,
          state: { generator: props.generator },
        }}
      >
        <img src={EditIcon} className={style.edit_icon} />
      </Link>
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
