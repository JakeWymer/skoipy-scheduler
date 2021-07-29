import { useState } from "react";
import Button from "../../components/Button";
import { Link, Redirect, useLocation, useParams } from "react-router-dom";
import MoonLoader from "react-spinners/MoonLoader";
import { ButtonTheme } from "../../components/Button/types";
import Input from "../../components/Input";
import { SeedType } from "../../components/SearchBar/types";
import { GeneratorSeed } from "../Dashboard/types";
import SearchBar from "../../components/SearchBar";

import style from "./style.module.scss";
import { useEffect } from "react";
import ApiClient from "../../api";
import { LinkDataState, Params, ScheduleTypes, ScheduleDays } from "./types";
import Select, { SelectOption } from "../../components/Select";
import { capitalize } from "lodash";
import SpinnerOrComponent from "../../components/SpinnerOrComponent";
import SelectedSeeds from "../../components/SelectedSeeds";

const GeneratorBuilder = () => {
  const [generatorSeeds, setGeneratorSeeds] = useState<GeneratorSeed[]>([]);
  const [generatorName, setGeneratorName] = useState<string>(``);
  const [generatorFrequency, setGeneratorFrequency] = useState<ScheduleTypes>(
    ScheduleTypes.NEVER
  );
  const [generatorDay, setGeneratorDay] = useState<ScheduleDays>(
    ScheduleDays.SUNDAY
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [shouldRedirect, setShouldRedirect] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const { state }: { state: LinkDataState } = useLocation();
  const params: Params = useParams();

  useEffect(() => {
    if (params?.generatorId) {
      if (state.generator) {
        setGeneratorName(state.generator.name);
        setGeneratorSeeds(state.generator.seeds);
        setIsEditing(true);
      } else {
        // Try to fetch generator here. This might happen if someone navigates directly to this page
      }
    }
    setIsLoading(false);
  }, []);

  const handleNameInput = (ev: any) => {
    setGeneratorName(ev.target.value);
  };

  const updateSeeds = (seed: any, type: SeedType) => {
    const newSeed: GeneratorSeed = {
      id: seed.id,
      type,
      name: seed.name,
    };
    if (type === SeedType.ARTIST) {
      newSeed.image = seed.images[1].url;
    } else {
      newSeed.image = seed.album.images[1].url;
      newSeed.artist = seed.artists[0].name;
      newSeed.album = seed.album.name;
    }
    setGeneratorSeeds([...generatorSeeds, newSeed]);
  };

  const createGenerator = async () => {
    setIsLoading(true);
    await ApiClient.post(
      "/generators",
      {
        generatorSeeds,
        generatorName,
        generatorFrequency,
        generatorDay:
          generatorFrequency === ScheduleTypes.WEEKLY ? generatorDay : null,
      },
      `Unable to create ${generatorName}`,
      `Created ${generatorName}`
    );
    setIsLoading(false);
    setGeneratorSeeds([]);
    setGeneratorName(``);
    setShouldRedirect(true);
  };

  const mapSeeds = () => {
    return generatorSeeds.map((seed, i) => {
      return (
        <div key={i}>
          <div>{seed.name}</div>
        </div>
      );
    });
  };

  const frequencyOptions = (): SelectOption[] => {
    return [
      {
        label: capitalize(ScheduleTypes.NEVER),
        value: ScheduleTypes.NEVER,
        isSelected: ScheduleTypes.NEVER === generatorFrequency,
      },
      {
        label: capitalize(ScheduleTypes.DAILY),
        value: ScheduleTypes.DAILY,
        isSelected: ScheduleTypes.DAILY === generatorFrequency,
      },
      {
        label: capitalize(ScheduleTypes.WEEKLY),
        value: ScheduleTypes.WEEKLY,
        isSelected: ScheduleTypes.WEEKLY === generatorFrequency,
      },
      {
        label: capitalize(ScheduleTypes.BIWEEKLY),
        value: ScheduleTypes.BIWEEKLY,
        isSelected: ScheduleTypes.BIWEEKLY === generatorFrequency,
      },
      {
        label: capitalize(ScheduleTypes.MONTHLY),
        value: ScheduleTypes.MONTHLY,
        isSelected: ScheduleTypes.MONTHLY === generatorFrequency,
      },
    ];
  };

  const dayOptions = (): SelectOption[] => {
    return [
      {
        label: capitalize(ScheduleDays.SUNDAY),
        value: ScheduleDays.SUNDAY,
        isSelected: ScheduleDays.SUNDAY === generatorDay,
      },
      {
        label: capitalize(ScheduleDays.MONDAY),
        value: ScheduleDays.MONDAY,
        isSelected: ScheduleDays.MONDAY === generatorDay,
      },
      {
        label: capitalize(ScheduleDays.TUESDAY),
        value: ScheduleDays.TUESDAY,
        isSelected: ScheduleDays.TUESDAY === generatorDay,
      },
      {
        label: capitalize(ScheduleDays.WEDNESDAY),
        value: ScheduleDays.WEDNESDAY,
        isSelected: ScheduleDays.WEDNESDAY === generatorDay,
      },
      {
        label: capitalize(ScheduleDays.THURSDAY),
        value: ScheduleDays.THURSDAY,
        isSelected: ScheduleDays.THURSDAY === generatorDay,
      },
      {
        label: capitalize(ScheduleDays.FRIDAY),
        value: ScheduleDays.FRIDAY,
        isSelected: ScheduleDays.FRIDAY === generatorDay,
      },
      {
        label: capitalize(ScheduleDays.SATURDAY),
        value: ScheduleDays.SATURDAY,
        isSelected: ScheduleDays.SATURDAY === generatorDay,
      },
    ];
  };

  if (shouldRedirect) {
    return <Redirect to="/dashboard" />;
  }

  const removeSeed = (seed: GeneratorSeed) => {
    const seedIndex = generatorSeeds.findIndex(
      (generatorSeed) => generatorSeed.id === seed.id
    );
    const seedsCopy = [...generatorSeeds];
    seedsCopy.splice(seedIndex, 1);
    setGeneratorSeeds(seedsCopy);
  };

  return (
    <div className={style.wrapper}>
      <Input
        handleChange={handleNameInput}
        value={generatorName}
        fontSize={32}
        placeholder="Generator Name"
      />
      <div className={style.scheduling_section}>
        <Select
          options={frequencyOptions()}
          handleChange={setGeneratorFrequency}
          label="Generation Frequency"
        />
        <Select
          options={dayOptions()}
          handleChange={setGeneratorDay}
          label="Generation Day"
          disabled={ScheduleTypes.WEEKLY !== generatorFrequency}
        />
      </div>
      <div className={style.selection_section}>
        <SearchBar updateSeeds={updateSeeds} />
        <SelectedSeeds seeds={generatorSeeds} removeSeed={removeSeed} />
      </div>
      <div className={style.control_buttons}>
        <Link to="/dashboard">
          <Button text="Cancel" theme={ButtonTheme.SECONDARY} />
        </Link>
        <Button
          text={isEditing ? "Save" : "Create"}
          clickHandler={createGenerator}
        />
      </div>
    </div>
  );
};

export default GeneratorBuilder;
