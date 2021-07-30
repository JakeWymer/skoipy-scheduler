import { useState } from "react";
import { Link } from "react-router-dom";
import mixpanel from "mixpanel-browser";
import ApiClient, { BaseApiResponse } from "../../api";
import { Generator } from "../../pages/Dashboard/types";
import Button from "../Button";
import { ButtonTheme } from "../Button/types";
import SpinnerOrComponent from "../SpinnerOrComponent";
import EditIcon from "./assets/edit.svg";
import { TrackingEvents, TrackingProperties } from "../../tracking";
import style from "./style.module.scss";

export type GeneratorCardProps = {
  generator: Generator;
};

const GeneratorCard = (props: GeneratorCardProps) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const generatePlaylist = async () => {
    mixpanel.track(TrackingEvents.CLICKED_GENERATE_PLAYLIST_BUTTON, {
      [TrackingProperties.GENERATOR_ID]: props.generator.id,
    });
    setIsGenerating(true);
    await ApiClient.post<BaseApiResponse>(
      `/generators/${props.generator.id}/generate`,
      {},
      `An error occurred`,
      `${props.generator.name} generated!`
    );
    setIsGenerating(false);
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
