import Button from "../Button";
import { ButtonTheme } from "../Button/types";
import { SeedType } from "../SearchBar/types";
import styles from "./style.module.scss";

type TrackItemProps = {
  track: any;
  key: number;
  addHandler: any;
  blockHandler?: any;
  isAdded?: boolean;
  isBlocked?: boolean;
};

const TrackItem = (props: TrackItemProps) => {
  const { isAdded, isBlocked, track, addHandler, blockHandler } = props;

  const artistName = track.artist;
  const trackName = track.name;
  const albumImg = track.image;
  const albumName = track.album;

  return (
    <div className={styles.wrapper}>
      <img src={albumImg} alt={artistName} />
      <div className={styles.track_info}>
        <div>{trackName}</div>
        <div className={styles.sub_header}>
          {albumName} | {artistName}
        </div>
      </div>
      <Button
        text={isAdded ? "Remove" : "Add"}
        theme={ButtonTheme.SECONDARY}
        clickHandler={() => addHandler(track, SeedType.TRACK)}
      />
      {blockHandler && (
        <Button
          text={isBlocked ? "Unblock" : "Block"}
          theme={ButtonTheme.SECONDARY}
          clickHandler={() => blockHandler(track, SeedType.TRACK)}
        />
      )}
    </div>
  );
};

export default TrackItem;
