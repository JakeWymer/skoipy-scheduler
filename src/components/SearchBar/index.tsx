import { useState } from "react";
import _ from "lodash";
import { SearchBarProps, SeedType, Artist, Track } from "./types";

import "./style.scss";
import ApiClient, { BaseApiResponse } from "../../api";
import SpinnerOrComponent from "../SpinnerOrComponent";

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

  const artistItem = (artist: any, key: number) => {
    const artistName = artist.name;
    let artistImg = `https://i.stack.imgur.com/y9DpT.jpg`;
    if (artist.images.length) {
      artistImg = artist.images[1].url;
    }
    return (
      <div key={key} className="search-result">
        <img src={artistImg} />
        {artistName}
        <button onClick={() => props.updateSeeds(artist, SeedType.ARTIST)}>
          Add
        </button>
      </div>
    );
  };

  const trackItem = (track: any, key: number) => {
    const artistName = track.artists[0].name;
    const trackName = track.name;
    const albumImg = track.album.images[1].url;
    const albumName = track.album.name;
    return (
      <div key={key} className="search-result">
        <img src={albumImg} />
        <div className="result-info">
          <div>{trackName}</div>
          <div className="sub-header">
            {albumName} | {artistName}
          </div>
        </div>
        <button onClick={() => props.updateSeeds(track, SeedType.TRACK)}>
          Add
        </button>
      </div>
    );
  };

  const mapResults = () => {
    return topResults.map((result: any, i) => {
      if (result.type === SeedType.ARTIST) {
        return artistItem(result, i);
      }
      return trackItem(result, i);
    });
  };

  return (
    <div className="search-wrapper">
      <input onChange={handleChange} value={term} id="search-bar" />
      <SpinnerOrComponent
        isLoading={isLoading}
        componentRenderer={mapResults}
      />
    </div>
  );
};

export default SearchBar;
