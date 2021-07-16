export type SearchBarProps = {
  updateSeeds: any;
};

export enum SeedType {
  ARTIST = `artist`,
  TRACK = `track`,
}

export type Artist = {
  id: string;
  images: [];
  name: string;
  popularity: number;
  type: SeedType.ARTIST;
  uri: string;
};

export type Track = {
  id: string;
  artists: Artist[];
  name: string;
  popularity: number;
  type: SeedType.TRACK;
  uri: string;
};
