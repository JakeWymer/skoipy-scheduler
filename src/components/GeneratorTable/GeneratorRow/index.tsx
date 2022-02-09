import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../Button";
import { ButtonTheme } from "../../Button/types";
import TabBar from "../../TabBar";
import ArrowRight from "./assets/right-arrow.png";
import styles from "./style.module.scss";
import { GeneratorRowProps, SubTableTabs } from "./types";
import SongImg from "./assets/song.png";
import ArtistImg from "./assets/artist.png";
import { SeedType } from "../../SearchBar/types";
import mixpanel from "mixpanel-browser";
import { TrackingEvents, TrackingProperties } from "../../../tracking";
import ApiClient, { BaseApiResponse } from "../../../api";
import SpinnerOrComponent from "../../SpinnerOrComponent";

const GeneratorRow = (props: GeneratorRowProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTab, setSelectedTab] = useState<SubTableTabs>(
    SubTableTabs.ADDED_SEEDS
  );
  const arrowClasses = `${styles.dropdown_icon} ${
    isExpanded ? styles.expanded : null
  }`;
  const populateSeedRows = () => {
    let seeds = props.generator.seeds || [];
    if (selectedTab === SubTableTabs.BLOCKED_SEEDS) {
      seeds = props.generator.blocked_seeds || [];
    }
    return seeds.map((seed) => {
      return (
        <div className={styles.sub_menu_row} key={seed.id}>
          <img src={seed.type === SeedType.ARTIST ? ArtistImg : SongImg} />
          <div>{seed.name}</div>
        </div>
      );
    });
  };
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
        text="Generate"
        theme={ButtonTheme.SECONDARY}
        clickHandler={generatePlaylist}
        styleOverride={{ margin: "auto" }}
      />
    );
  };
  return (
    <>
      <tr className={styles.row}>
        <td>
          <img
            src={ArrowRight}
            alt=""
            className={arrowClasses}
            onClick={() => setIsExpanded(!isExpanded)}
          />
        </td>
        <td>
          <Link
            to={{
              pathname: `/generator/${props.generator.id}/edit`,
              state: { generator: props.generator },
            }}
          >
            <span className={styles.name}>{props.generator.name}</span>
          </Link>
        </td>
        <td>{props.generator.schedule_frequency}</td>
        <td className={styles.generate_column}>
          <SpinnerOrComponent
            isLoading={isGenerating}
            componentRenderer={generateButtonRenderer}
            spinnerColor="#6f9ceb"
          />
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={6} className={styles.sub_menu_cell}>
            <div className={styles.sub_menu_table}>
              <div className={styles.sub_menu_header}>
                <TabBar
                  tabs={[SubTableTabs.ADDED_SEEDS, SubTableTabs.BLOCKED_SEEDS]}
                  selectedTab={selectedTab || SubTableTabs.ADDED_SEEDS}
                  handleTabClick={(tab: SubTableTabs) => setSelectedTab(tab)}
                />
              </div>
              <div>{populateSeedRows()}</div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default GeneratorRow;
