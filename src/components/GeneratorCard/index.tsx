import { useState } from "react";
import { Link } from "react-router-dom";
import mixpanel from "mixpanel-browser";
import Swal from "sweetalert2";
import ApiClient, { BaseApiResponse } from "../../api";
import { Generator, GeneratorResponse } from "../../pages/Dashboard/types";
import Button from "../Button";
import { ButtonTheme } from "../Button/types";
import SpinnerOrComponent from "../SpinnerOrComponent";
import EditIcon from "./assets/edit.svg";
import DeleteIcon from "./assets/delete-icon.svg";
import { TrackingEvents, TrackingProperties } from "../../tracking";
import style from "./style.module.scss";

export type GeneratorCardProps = {
  generator: Generator;
  setUserGenerators: any;
  isOwner: boolean;
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

  const deleteGenerator = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#db2b39",
      cancelButtonColor: "#8B939C",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const data = await ApiClient.apiDelete<GeneratorResponse>(
          `/generators/${props.generator.id}`,
          `Could not delete ${props.generator.name}`,
          `Deleted ${props.generator.name}`
        );
        if (!data.isError) {
          props.setUserGenerators(data.generators);
        }
      }
    });
  };

  return (
    <div className={style.generator_card_wrapper}>
      {props.isOwner && (
        <>
          <Link
            to={{
              pathname: `/generator/${props.generator.id}/edit`,
              state: { generator: props.generator },
            }}
          >
            <img src={EditIcon} className={style.edit_icon} alt="edit" />
          </Link>
          <img
            alt="delete"
            src={DeleteIcon}
            className={style.delete_icon}
            onClick={deleteGenerator}
          />
        </>
      )}
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
