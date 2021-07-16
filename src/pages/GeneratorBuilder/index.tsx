import { useState } from "react";
import Button from "../../components/Button";
import { Link, Redirect, useLocation, useParams } from "react-router-dom";
import MoonLoader from "react-spinners/MoonLoader";
import { ButtonTheme } from "../../components/Button/types";
import Input from "../../components/Input";
import { SeedType } from "../../components/SearchBar/types";
import { Generator, GeneratorSeed } from "../Dashboard/types";
import SearchBar from "../../components/SearchBar";

import style from "./style.module.scss";
import { useEffect } from "react";
import ApiClient from "../../api";

type GeneratorBuilderProps = {
  setUserGenerators: any;
};

type LinkDataState = {
  generator?: Generator;
};

type Params = {
  generatorId?: string;
};

const GeneratorBuilder = (props: GeneratorBuilderProps) => {
  const [generatorSeeds, setGeneratorSeeds] = useState<GeneratorSeed[]>([]);
  const [generatorName, setGeneratorName] = useState<string>(``);
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

  if (shouldRedirect) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className={style.wrapper}>
      <Input
        handleChange={handleNameInput}
        value={generatorName}
        fontSize={32}
        placeholder="Generator Name"
      />
      <SearchBar updateSeeds={updateSeeds} />
      {mapSeeds()}
      {isLoading ? (
        <MoonLoader color="#b7b5e4" loading={isLoading} size={30} />
      ) : (
        <Button
          text={isEditing ? "Save" : "Create"}
          clickHandler={createGenerator}
        />
      )}
      <Link to="/dashboard">
        <Button text="Cancel" theme={ButtonTheme.SECONDARY} />
      </Link>
    </div>
  );
};

export default GeneratorBuilder;
