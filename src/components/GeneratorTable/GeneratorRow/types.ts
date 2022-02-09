import { Generator } from "../../../pages/Dashboard/types";

export type GeneratorRowProps = {
  generator: Generator;
};

export enum SubTableTabs {
  ADDED_SEEDS = `Added Seeds`,
  BLOCKED_SEEDS = `Blocked Seeds`,
}
