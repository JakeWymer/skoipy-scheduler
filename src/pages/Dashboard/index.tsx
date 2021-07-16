import { useState, useEffect } from "react";
import axios from "axios";
import MoonLoader from "react-spinners/MoonLoader";
import { ToastContainer } from "react-toastify";
import Button from "../../components/Button";
import { ButtonTheme } from "../../components/Button/types";
import Modal from "react-modal";
import SearchBar from "../../components/SearchBar";
import { SeedType } from "../../components/SearchBar/types";
import { GeneratorSeed, Generator } from "./types";
import Input from "../../components/Input";
import { successToast, errorToast } from "../../utils";
import GeneratorCard from "../../components/GeneratorCard";
import styles from "./style.module.scss";

const Dashboard = () => {
  Modal.setAppElement("#root");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [generatorSeeds, setGeneratorSeeds] = useState<GeneratorSeed[]>([]);
  const [generatorName, setGeneratorName] = useState<string>(``);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userGenerators, setUserGenerators] = useState<Generator[]>([]);

  useEffect(() => {
    axios.get(`/generators`).then(({ data: generators }) => {
      setUserGenerators(generators);
    });
  }, []);

  const handleModal = () => {
    setModalIsOpen(!modalIsOpen);
  };

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
    const { data: generatorsResponse } = await axios.post("/generators", {
      generatorSeeds,
      generatorName,
    });
    setIsLoading(false);
    handleModal();
    setGeneratorSeeds([]);
    setGeneratorName(``);
    if (generatorsResponse.error) {
      errorToast(generatorsResponse.error);
    } else {
      successToast(`Created ${generatorName}`);
    }
    setUserGenerators(generatorsResponse.generators);
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

  const mapGenerators = () => {
    return userGenerators.map((generator, i) => {
      return <GeneratorCard key={i} generator={generator} />;
    });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.greeting}>
        <h1>Heyoo</h1>
      </div>
      <Button text="Schedule New Generator" clickHandler={handleModal} />
      <hr />
      <div className={styles.generator_cards_wrapper}>{mapGenerators()}</div>
      <Modal isOpen={modalIsOpen} shouldCloseOnOverlayClick={true}>
        <h2>Add new Skoipy Generator</h2>
        <Input
          handleChange={handleNameInput}
          value={generatorName}
          fontSize={32}
          placeholder="Name"
        />
        <SearchBar updateSeeds={updateSeeds} />
        {mapSeeds()}
        {isLoading ? (
          <MoonLoader color="#b7b5e4" loading={isLoading} size={30} />
        ) : (
          <Button
            text="Create"
            theme={ButtonTheme.PRIMARY}
            clickHandler={createGenerator}
          />
        )}
        <Button
          text="Cancel"
          theme={ButtonTheme.SECONDARY}
          clickHandler={handleModal}
        />
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default Dashboard;
