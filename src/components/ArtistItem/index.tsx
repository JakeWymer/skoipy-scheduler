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
  const { isAdded, artist, key, clickHandler } = props;
  const artistName = artist.name;
  let artistImg = `https://i.stack.imgur.com/y9DpT.jpg`;
  if (isAdded) {
    artistImg = artist.image;
  }
  if (artist?.images && artist?.images.length) {
    artistImg = artist.images[1].url;
  }
  return (
    <div key={key} className={styles.wrapper}>
      <img src={artistImg} />
      <span className={styles.artist_name}>{artistName}</span>
      <Button
        text={isAdded ? "Remove" : "Add"}
        clickHandler={() => clickHandler(artist, SeedType.ARTIST)}
      />
    </div>
  );
};

export default artistItem;
