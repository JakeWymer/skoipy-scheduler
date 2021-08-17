import { GeneratorSeed } from "../../pages/Dashboard/types";
import ArtistItem from "../ArtistItem";
import { SeedType } from "../SearchBar/types";
import TrackItem from "../TrackItem";
import styles from "./style.module.scss";

type SelectedSeedsProps = {
  seeds: GeneratorSeed[];
  removeSeed: any;
};

const SelectedSeeds = (props: SelectedSeedsProps) => {
  const getArtists = () => {
    return props.seeds
      .filter((seed) => {
        return seed.type === SeedType.ARTIST;
      })
      .map((seed, i) => {
        return (
          <ArtistItem
            artist={seed}
            addHandler={props.removeSeed}
            key={i}
            isAdded
          />
        );
      });
  };

  const getTracks = () => {
    return props.seeds
      .filter((seed) => {
        return seed.type === SeedType.TRACK;
      })
      .map((seed, i) => {
        return (
          <TrackItem
            track={seed}
            addHandler={props.removeSeed}
            key={i}
            isAdded
          />
        );
      });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.artists}>Artists{getArtists()}</div>
      <div className={styles.tracks}>Tracks{getTracks()}</div>
    </div>
  );
};

export default SelectedSeeds;
