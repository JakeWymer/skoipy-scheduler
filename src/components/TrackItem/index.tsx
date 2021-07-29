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
  const { isAdded, track, key, clickHandler } = props;
  let artistName;
  let trackName;
  let albumImg;
  let albumName;
  if (isAdded) {
    artistName = track.artist;
    trackName = track.name;
    albumImg = track.image;
    albumName = track.album;
  } else {
    artistName = track.artists[0].name;
    trackName = track.name;
    albumImg = track.album.images[1].url;
    albumName = track.album.name;
  }
  return (
    <div key={key} className={styles.wrapper}>
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
