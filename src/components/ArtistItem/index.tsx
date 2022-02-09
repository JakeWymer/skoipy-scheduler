import Button from "../Button";
import { ButtonTheme } from "../Button/types";
import { SeedType } from "../SearchBar/types";
import styles from "./style.module.scss";

type ArtistItemProps = {
  artist: any;
  key: number;
  addHandler: any;
  blockHandler?: any;
  isAdded?: boolean;
  isBlocked?: boolean;
};

const artistItem = (props: ArtistItemProps) => {
  const { isAdded, artist, addHandler, blockHandler, isBlocked } = props;
  const artistName = artist.name;

  const artistImg = artist?.image || `https://i.stack.imgur.com/y9DpT.jpg`;

  return (
    <div className={styles.wrapper}>
      <img src={artistImg} alt={artistName} />
      <span className={styles.artist_name}>{artistName}</span>
      <Button
        text={isAdded ? "Remove" : "Add"}
        theme={ButtonTheme.SECONDARY}
        clickHandler={() => addHandler(artist, SeedType.ARTIST)}
      />
      {blockHandler && (
        <Button
          text={isBlocked ? "Unblock" : "Block"}
          theme={ButtonTheme.SECONDARY}
          clickHandler={() => blockHandler(artist, SeedType.ARTIST)}
        />
      )}
    </div>
  );
};

export default artistItem;
