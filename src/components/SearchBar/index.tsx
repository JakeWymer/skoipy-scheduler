import { useState } from "react";
import _ from "lodash";
import { SearchBarProps, SeedType, Artist, Track } from "./types";

import styles from "./style.module.scss";
import ApiClient, { BaseApiResponse } from "../../api";
import SpinnerOrComponent from "../SpinnerOrComponent";
import ArtistItem from "../ArtistItem";
import TrackItem from "../TrackItem";
import Input from "../Input";
import { useEffect } from "react";
import { GeneratorSeed } from "../../pages/Dashboard/types";

interface SearchResponse extends BaseApiResponse {
  artists: { items: Artist[] };
  tracks: { items: Track[] };
}

const SearchBar = (props: SearchBarProps) => {
  const [term, setTerm] = useState(``);
  const [topResults, setTopResults] = useState<(Artist | Track)[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedSeeds, setSelectedSeeds] = useState<GeneratorSeed[]>([]);
  const [blockedSeeds, setBlockedSeeds] = useState<GeneratorSeed[]>([]);

  useEffect(() => {
    setSelectedSeeds(props.selectedSeeds);
    setBlockedSeeds(props.blockedSeeds);
  }, [props.selectedSeeds, props.blockedSeeds]);

  const addOrRemoveSeed = (seed: any, type: SeedType) => {
    const seedIndex = selectedSeeds.findIndex(
      (currentSeed) => currentSeed.id === seed.id
    );
    let seeds: GeneratorSeed[] = [];
    if (seedIndex >= 0) {
      seeds = [...selectedSeeds];
      seeds.splice(seedIndex, 1);
    } else {
      seeds = [...selectedSeeds, seed];
    }
    setSelectedSeeds(seeds);
    props.updateSeeds(seeds);
  };

  const blockOrUnblockSeed = (seed: any, type: SeedType) => {
    const seedIndex = blockedSeeds.findIndex(
      (currentSeed) => currentSeed.id === seed.id
    );
    let seeds: GeneratorSeed[] = [];
    if (seedIndex >= 0) {
      seeds = [...blockedSeeds];
      seeds.splice(seedIndex, 1);
    } else {
      seeds = [...blockedSeeds, seed];
    }
    setBlockedSeeds(seeds);
    props.updateSeeds(seeds, true);
  };

  const parseSeed = (seed: any, type: SeedType) => {
    const newSeed: GeneratorSeed = {
      id: seed.id,
      type,
      name: seed.name,
    };
    if (type === SeedType.ARTIST) {
      newSeed.image = seed.images.length
        ? seed.images[1].url
        : `https://i.stack.imgur.com/y9DpT.jpg`;
    } else {
      newSeed.image = seed.album.images[1].url;
      newSeed.artist = seed.artists[0].name;
      newSeed.album = seed.album.name;
    }
    return newSeed;
  };

  let inflightSearch: any = null;

  const handleChange = (ev: any) => {
    const term = ev.target.value;
    setTerm(term);
    const delayedSearch = _.debounce(
      async () => await handleSearch(term),
      2000,
      { leading: true }
    );
    if (inflightSearch) {
      inflightSearch.cancel();
    }
    inflightSearch = delayedSearch();
  };

  const handleSearch = async (searchTerm: string) => {
    setIsLoading(true);
    if (searchTerm.length) {
      const searchResult = await ApiClient.get<SearchResponse>(
        `/spotify/search?term=${encodeURI(searchTerm)}`,
        `There was a problem completing your request`
      );
      const topArtists = processResults(searchResult.artists?.items);
      const topTracks = processResults(searchResult.tracks?.items);
      const topResults = [...topArtists, ...topTracks].sort((a: any, b: any) =>
        a.popularity < b.popularity ? 1 : -1
      );
      topResults.forEach((item: Artist | Track, i: number) => {
        if (item.name.toLowerCase() === searchTerm.toLowerCase()) {
          topResults.splice(i, 1);
          topResults.unshift(item);
        }
      });
      setTopResults(topResults);
    } else {
      setTopResults([]);
    }
    setIsLoading(false);
    inflightSearch = null;
  };

  const processResults = (results: (Artist | Track)[]) => {
    if (!results || !results.length) {
      results = [];
    }
    results.sort((a: any, b: any) => (a.popularity < b.popularity ? 1 : -1));
    return results.slice(0, 5);
  };

  const mapResults = () => {
    const parsedResults = topResults.map((seed) => parseSeed(seed, seed.type));
    const res = parsedResults.map((result: any, i) => {
      const isAdded = selectedSeeds.find((seed) => seed.id === result.id);
      const isBlocked = blockedSeeds.find((seed) => seed.id === result.id);

      if (result.type === SeedType.ARTIST) {
        return (
          <ArtistItem
            artist={result}
            key={i}
            addHandler={addOrRemoveSeed}
            isAdded={!!isAdded}
            blockHandler={blockOrUnblockSeed}
            isBlocked={!!isBlocked}
          />
        );
      }
      return (
        <TrackItem
          track={result}
          key={i}
          addHandler={addOrRemoveSeed}
          isAdded={!!isAdded}
          blockHandler={blockOrUnblockSeed}
          isBlocked={!!isBlocked}
        />
      );
    });
    return res;
  };

  return (
    <div className={styles.search_wrapper}>
      <div className={styles.search_bar}>
        <Input
          handleChange={handleChange}
          value={term}
          label="Search Spotify"
          fontSize={18}
          placeholder="Search for a song or artist"
        />
      </div>
      <div className={styles.search_results}>
        <SpinnerOrComponent
          isLoading={isLoading}
          componentRenderer={mapResults}
        />
      </div>
    </div>
  );
};

export default SearchBar;
