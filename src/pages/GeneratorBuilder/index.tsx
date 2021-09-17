import { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Button from "../../components/Button";
import { Link, Redirect, useLocation, useParams } from "react-router-dom";
import { ButtonTheme } from "../../components/Button/types";
import Input from "../../components/Input";
import { GeneratorSeed } from "../Dashboard/types";
import SearchBar from "../../components/SearchBar";

import style from "./style.module.scss";
import { useEffect } from "react";
import ApiClient from "../../api";
import {
  LinkDataState,
  Params,
  ScheduleTypes,
  ScheduleDays,
  SingleGeneratorResponse,
} from "./types";
import Select, { SelectOption } from "../../components/Select";
import { capitalize } from "lodash";
import SelectedSeeds from "../../components/SelectedSeeds";
import { arraysAreEqual, successToast, warningToast } from "../../utils";
import FadedHr from "../../components/FadedHr";
import { AuthProps } from "../../AuthedRoute";
import LoadingSpinner from "../../components/LoadingSpinner";
import TabBar from "../../components/TabBar";
import { TabNames } from "./types";

const GeneratorBuilder = (props: AuthProps) => {
  const [generatorSeeds, setGeneratorSeeds] = useState<GeneratorSeed[]>([]);
  const [blockedSeeds, setBlockedSeeds] = useState<GeneratorSeed[]>([]);
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
  const [overwriteExisting, setOverwriteExisting] = useState<boolean>(false);
  const [generatorOwner, setGeneratorOwner] = useState<number>();
  const [selectedTab, setSelectedTab] = useState<string>(TabNames.SEEDS);

  const { state }: { state: LinkDataState } = useLocation();
  const params: Params = useParams();

  const updateGenerator = (
    name: string,
    seeds: GeneratorSeed[],
    frequency: ScheduleTypes,
    day: ScheduleDays,
    text: boolean,
    phone: string,
    overwriteExisting: boolean,
    blocked_seeds: GeneratorSeed[]
  ) => {
    setGeneratorName(name);
    setGeneratorSeeds(seeds);
    setGeneratorFrequency(frequency);
    setGeneratorDay(day);
    setOptInText(text);
    setPhoneNumber(phone);
    setIsEditing(true);
    setOverwriteExisting(overwriteExisting);
    setBlockedSeeds(blocked_seeds || []);
  };

  useEffect(() => {
    setIsLoading(true);
    let generatorId = params?.generatorId && parseInt(params.generatorId);
    if (generatorId) {
      setIsEditing(true);
    }
    if (isEditing) {
      if (state?.generator) {
        const {
          name,
          seeds,
          schedule_frequency,
          schedule_day,
          opt_in_text,
          phone_number,
          overwrite_existing,
          owner_id,
          blocked_seeds,
        } = state.generator;
        setGeneratorOwner(owner_id);
        updateGenerator(
          name,
          seeds,
          schedule_frequency,
          schedule_day,
          opt_in_text,
          phone_number,
          overwrite_existing,
          blocked_seeds
        );
      } else {
        // Try to fetch generator here. This might happen if someone navigates directly to this page
        ApiClient.get<SingleGeneratorResponse>(
          `/generators/${generatorId}`,
          `Failed to fetch generator`
        ).then((response) => {
          if (!response.generator) {
            setShouldRedirect(true);
          }
          const {
            name,
            seeds,
            schedule_frequency,
            schedule_day,
            opt_in_text,
            phone_number,
            overwrite_existing,
            owner_id,
            blocked_seeds,
          } = response.generator;
          updateGenerator(
            name,
            seeds,
            schedule_frequency,
            schedule_day,
            opt_in_text,
            phone_number,
            overwrite_existing,
            blocked_seeds
          );
          setGeneratorOwner(owner_id);
        });
      }
    }
    setIsLoading(false);
  }, [params.generatorId, state?.generator, isEditing]);

  useEffect(() => {
    if (generatorOwner && generatorOwner !== props.user.id) {
      warningToast(`You must be owner of a generator to edit it`);
      setShouldRedirect(true);
    }
  }, [generatorOwner, props.user.id]);

  const handleNameInput = (ev: any) => {
    setGeneratorName(ev.target.value);
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
          overwriteExisting,
          blockedSeeds,
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
          overwriteExisting,
          blockedSeeds,
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

  const removeSeed = (
    seed: GeneratorSeed,
    seedArray: GeneratorSeed[],
    seedUpdater: any
  ) => {
    const seedIndex = seedArray.findIndex(
      (generatorSeed) => generatorSeed.id === seed.id
    );
    const seedsCopy = [...seedArray];
    seedsCopy.splice(seedIndex, 1);
    seedUpdater(seedsCopy);
  };

  const handleAddButton = () => {
    const MySwal = withReactContent(Swal);
    let seeds: GeneratorSeed[] = [...generatorSeeds];
    let tempBlockedSeeds: GeneratorSeed[] = [...blockedSeeds];
    MySwal.fire({
      html: (
        <SearchBar
          selectedSeeds={seeds}
          blockedSeeds={tempBlockedSeeds}
          updateSeeds={(newSeeds: GeneratorSeed[], isBlock = false) => {
            if (!isBlock) {
              seeds = newSeeds;
            } else {
              tempBlockedSeeds = newSeeds;
            }
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
        setBlockedSeeds(tempBlockedSeeds);
      },
    });
  };

  const handleOptInText = (ev: any) => {
    setOptInText(ev.target.checked);
  };

  const handleOverwriteExisting = (ev: any) => {
    setOverwriteExisting(ev.target.checked);
  };

  const handlePhoneNumber = (ev: any) => {
    setPhoneNumber(ev.target.value);
  };

  const handleTabClick = (tab: string) => {
    setSelectedTab(tab);
  };

  const renderCurrentTab = () => {
    switch (selectedTab) {
      case TabNames.SEEDS:
        return seedsSection;
      case TabNames.ADVANCED:
        return advancedSection;
      case TabNames.SHARING:
        return sharingSection;
    }
  };

  const seedsSection = (
    <div>
      <Button text="Add Seeds" clickHandler={handleAddButton} />
      <FadedHr />
      <div className={style.selection_section}>
        <SelectedSeeds
          seeds={generatorSeeds}
          removeSeed={(seed: GeneratorSeed) =>
            removeSeed(seed, generatorSeeds, setGeneratorSeeds)
          }
        />
      </div>
      <div className={style.selection_section}>
        <SelectedSeeds
          seeds={blockedSeeds}
          removeSeed={(seed: GeneratorSeed) =>
            removeSeed(seed, blockedSeeds, setBlockedSeeds)
          }
        />
      </div>
    </div>
  );

  const advancedSection = (
    <div>
      <div className={style.check_box}>
        <label htmlFor="overwrite-existing">Overwrite existing playlist</label>
        <input
          type="checkbox"
          checked={overwriteExisting}
          onChange={handleOverwriteExisting}
          name="overwrite-existing"
        ></input>
      </div>
      <div className={style.check_box}>
        <label htmlFor="opt-in">Opt into texts for this playlist</label>
        <input
          type="checkbox"
          checked={optInText}
          onChange={handleOptInText}
          name="opt-in"
        ></input>
      </div>
      <Input
        placeholder="Phone Number"
        handleChange={handlePhoneNumber}
        value={phoneNumber}
        disabled={!optInText}
      />
    </div>
  );

  const sharingSection = <div>coming soon</div>;

  if (isLoading) {
    return <LoadingSpinner />;
  }

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
      <TabBar
        tabs={[TabNames.SEEDS, TabNames.ADVANCED, TabNames.SHARING]}
        handleTabClick={handleTabClick}
        selectedTab={selectedTab}
      />
      {renderCurrentTab()}

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
