import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Generator } from "../../pages/Dashboard/types";
import { successToast } from "../../utils";
import Button from "../Button";
import { ButtonTheme } from "../Button/types";
import SpinnerOrComponent from "../SpinnerOrComponent";
import EditIcon from "./assets/edit.svg";
import style from "./style.module.scss";

export type GeneratorCardProps = {
  generator: Generator;
};

const GeneratorCard = (props: GeneratorCardProps) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const generatePlaylist = async () => {
    setIsGenerating(true);
    const res = await axios.post(`/generators/${props.generator.id}/generate`);
    setIsGenerating(false);
    if (!res.data?.error) {
      successToast(res.data);
    }
  };

  const generateButtonRenderer = () => {
    return (
      <Button
        text="Generate Playlist"
        theme={ButtonTheme.GREEN}
        clickHandler={generatePlaylist}
      />
    );
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
        <SpinnerOrComponent
          isLoading={isGenerating}
          componentRenderer={generateButtonRenderer}
          spinnerColor="#85cb7f"
        />
      </div>
    </div>
  );
};

export default GeneratorCard;
