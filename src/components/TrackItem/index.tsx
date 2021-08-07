import Button from "../Button";
import { SeedType } from "../SearchBar/types";
import styles from "./style.module.scss";

type TrackItemProps = {
  track: any;
  key: number;
  clickHandler: any;
  isAdded?: boolean;
};

const TrackItem = (props: TrackItemProps) => {
  const { isAdded, track, clickHandler } = props;

  const artistName = track.artist;
  const trackName = track.name;
  const albumImg = track.image;
  const albumName = track.album;

  return (
    <div className={styles.wrapper}>
      <img src={albumImg} />
      <div className={styles.track_info}>
        <div>{trackName}</div>
        <div className={styles.sub_header}>
          {albumName} | {artistName}
        </div>
      </div>
      <Button
        text={isAdded ? "Remove" : "Add"}
        clickHandler={() => clickHandler(track, SeedType.TRACK)}
      />
    </div>
  );
};

export default TrackItem;
