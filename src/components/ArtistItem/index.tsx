import Button from "../Button";
import { SeedType } from "../SearchBar/types";
import styles from "./style.module.scss";

type ArtistItemProps = {
  artist: any;
  key: number;
  clickHandler: any;
  isAdded?: boolean;
};

const artistItem = (props: ArtistItemProps) => {
  const { isAdded, artist, clickHandler } = props;
  const artistName = artist.name;

  const artistImg = artist?.image || `https://i.stack.imgur.com/y9DpT.jpg`;

  return (
    <div className={styles.wrapper}>
      <img src={artistImg} alt={artistName} />
      <span className={styles.artist_name}>{artistName}</span>
      <Button
        text={isAdded ? "Remove" : "Add"}
        clickHandler={() => clickHandler(artist, SeedType.ARTIST)}
      />
    </div>
  );
};

export default artistItem;
