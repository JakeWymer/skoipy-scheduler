import { BaseApiResponse } from "../../api";
import { SeedType } from "../../components/SearchBar/types";

export type GeneratorSeed = {
  id: string;
  type: SeedType;
  name: string;
  image?: string;
  artist?: string;
  album?: string;
};

export type Generator = {
  id: number;
  name: string;
  seeds: GeneratorSeed[];
};

export interface GeneratorResponse extends BaseApiResponse {
  generators: Generator[];
}
