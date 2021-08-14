import { BaseApiResponse } from "../../api";
import { Generator } from "../Dashboard/types";

export type LinkDataState = {
  generator?: Generator;
};

export type Params = {
  generatorId?: string;
};

export enum ScheduleTypes {
  DAILY = `daily`,
  WEEKLY = `weekly`,
  BIWEEKLY = `bi-weekly`,
  MONTHLY = `monthly`,
  NEVER = `never`,
}

export enum ScheduleDays {
  SUNDAY = `sunday`,
  MONDAY = `monday`,
  TUESDAY = `tuesday`,
  WEDNESDAY = `wednesday`,
  THURSDAY = `thursday`,
  FRIDAY = `friday`,
  SATURDAY = `saturday`,
}

export interface SingleGeneratorResponse extends BaseApiResponse {
  generator: Generator;
}
