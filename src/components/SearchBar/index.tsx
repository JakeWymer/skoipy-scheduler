import { useState } from "react";
import { SearchBarProps, SeedType } from "./types";
import axios from "axios";

import "./style.scss";

const SearchBar = (props: SearchBarProps) => {
  const [term, setTerm] = useState(``);
  const [topResults, setTopResults] = useState([]);

  let timer: NodeJS.Timeout;

  const handleChange = async (ev: any) => {
    const term = ev.target.value;
    setTerm(term);
    const searchTerm = encodeURI(term);
    clearTimeout(timer);
    timer = setTimeout(() => {
      handleSearch(searchTerm);
    }, 2000);
  };

  const handleSearch = async (searchTerm: string) => {
    if (searchTerm.length) {
      const searchResult = await axios.get(
        `/spotify/search?term=${searchTerm}`
      );
      const topArtists = processResults(searchResult.data.artists?.items);
      const topTracks = processResults(searchResult.data.tracks?.items);
      setTopResults([...topArtists, ...topTracks]);
    } else {
      setTopResults([]);
    }
  };

  const processResults = (results: []) => {
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
      <div>{mapResults()}</div>
    </div>
  );
};

export default SearchBar;
