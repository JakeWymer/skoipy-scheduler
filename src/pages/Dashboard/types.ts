import { BaseApiResponse } from "../../api";
import { SeedType } from "../../components/SearchBar/types";
import { ScheduleDays, ScheduleTypes } from "../GeneratorBuilder/types";

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
  schedule_frequency: ScheduleTypes;
  schedule_day: ScheduleDays;
  opt_in_text: boolean;
  phone_number: string;
  overwrite_existing: boolean;
};

export interface GeneratorResponse extends BaseApiResponse {
  generators: Generator[];
}
