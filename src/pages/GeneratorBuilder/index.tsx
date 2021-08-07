import { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Button from "../../components/Button";
import { Link, Redirect, useLocation, useParams } from "react-router-dom";
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
import SelectedSeeds from "../../components/SelectedSeeds";
import { arraysAreEqual, successToast } from "../../utils";
import FadedHr from "../../components/FadedHr";

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
  const [optInText, setOptInText] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>(``);

  const { state }: { state: LinkDataState } = useLocation();
  const params: Params = useParams();

  useEffect(() => {
    if (params?.generatorId) {
      if (state.generator) {
        setGeneratorName(state.generator.name);
        setGeneratorSeeds(state.generator.seeds);
        setGeneratorFrequency(state.generator.schedule_frequency);
        setGeneratorDay(state.generator.schedule_day);
        setOptInText(state.generator.opt_in_text);
        setPhoneNumber(state.generator.phone_number);
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

  const updateSeeds = (seeds: GeneratorSeed[]) => {
    setGeneratorSeeds(seeds);
  };

  const createOrUpdateGenerator = async () => {
    setIsLoading(true);
    if (isEditing) {
      await ApiClient.put(
        `/generators/${params.generatorId}`,
        {
          generatorSeeds,
          generatorName,
          generatorFrequency,
          generatorDay:
            generatorFrequency === ScheduleTypes.WEEKLY ? generatorDay : null,
          optInText,
          phoneNumber,
        },
        `Unable to update ${generatorName}`,
        `Updated ${generatorName}`
      );
    } else {
      await ApiClient.post(
        "/generators",
        {
          generatorSeeds,
          generatorName,
          generatorFrequency,
          generatorDay:
            generatorFrequency === ScheduleTypes.WEEKLY ? generatorDay : null,
          optInText,
          phoneNumber,
        },
        `Unable to create ${generatorName}`,
        `Created ${generatorName}`
      );
    }
    setIsLoading(false);
    setGeneratorSeeds([]);
    setGeneratorName(``);
    setShouldRedirect(true);
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

  const handleAddButton = () => {
    const MySwal = withReactContent(Swal);
    let seeds: GeneratorSeed[] = [...generatorSeeds];
    MySwal.fire({
      html: (
        <SearchBar
          selectedSeeds={seeds}
          updateSeeds={(newSeeds: GeneratorSeed[]) => {
            seeds = newSeeds;
          }}
        />
      ),
      width: `1000px`,
      confirmButtonColor: `#3a405a`,
      preConfirm: () => {
        if (!arraysAreEqual(seeds, generatorSeeds)) {
          successToast(`Successfully updated seeds`);
        }
        setGeneratorSeeds(seeds);
      },
    });
  };

  const handleOptInText = (ev: any) => {
    setOptInText(ev.target.checked);
  };

  const handlePhoneNumber = (ev: any) => {
    setPhoneNumber(ev.target.value);
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
      <label htmlFor="opt-in">Opt into texts for this playlist</label>
      <br></br>
      <input
        type="checkbox"
        checked={optInText}
        onChange={handleOptInText}
        name="opt-in"
      ></input>
      <Input
        placeholder="Phone Number"
        handleChange={handlePhoneNumber}
        value={phoneNumber}
        disabled={!optInText}
      />
      <Button text="Add Seeds" clickHandler={handleAddButton} />
      <FadedHr />
      <div className={style.selection_section}>
        <SelectedSeeds seeds={generatorSeeds} removeSeed={removeSeed} />
      </div>
      <div className={style.control_buttons}>
        <Link to="/dashboard">
          <Button text="Cancel" theme={ButtonTheme.SECONDARY} />
        </Link>
        <Button
          text={isEditing ? "Save" : "Create"}
          clickHandler={createOrUpdateGenerator}
        />
      </div>
    </div>
  );
};

export default GeneratorBuilder;
