import { useState } from "react";
import _ from "lodash";
import { SearchBarProps, SeedType, Artist, Track } from "./types";

import styles from "./style.module.scss";
import ApiClient, { BaseApiResponse } from "../../api";
import SpinnerOrComponent from "../SpinnerOrComponent";
import ArtistItem from "../ArtistItem";
import TrackItem from "../TrackItem";
import Input from "../Input";

interface SearchResponse extends BaseApiResponse {
  artists: { items: Artist[] };
  tracks: { items: Track[] };
}

const SearchBar = (props: SearchBarProps) => {
  const [term, setTerm] = useState(``);
  const [topResults, setTopResults] = useState<(Artist | Track)[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    return topResults.map((result: any, i) => {
      if (result.type === SeedType.ARTIST) {
        return (
          <ArtistItem
            artist={result}
            key={i}
            clickHandler={props.updateSeeds}
          />
        );
      }
      return (
        <TrackItem track={result} key={i} clickHandler={props.updateSeeds} />
      );
    });
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
      <SpinnerOrComponent
        isLoading={isLoading}
        componentRenderer={mapResults}
      />
    </div>
  );
};

export default SearchBar;
