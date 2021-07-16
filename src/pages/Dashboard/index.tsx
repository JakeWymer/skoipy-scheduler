import { useState, useEffect } from "react";
import Button from "../../components/Button";
import Modal from "react-modal";
import { Generator, GeneratorResponse } from "./types";
import GeneratorCard from "../../components/GeneratorCard";
import styles from "./style.module.scss";
import { Link } from "react-router-dom";
import { AuthProps } from "../../AuthedRoute";
import SpinnerOrComponent from "../../components/SpinnerOrComponent";
import ApiClient from "../../api";

const Dashboard = (props: AuthProps) => {
  Modal.setAppElement("#root");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userGenerators, setUserGenerators] = useState<Generator[]>([]);

  useEffect(() => {
    ApiClient.get<GeneratorResponse>(`/generators`).then(
      (response: GeneratorResponse) => {
        setUserGenerators(response.generators);
        setIsLoading(false);
      }
    );
  }, []);

  const handleModal = () => {
    setModalIsOpen(!modalIsOpen);
  };

  const mapGenerators = () => {
    return userGenerators.map((generator, i) => {
      return <GeneratorCard key={i} generator={generator} />;
    });
  };

  const generatorsRenderer = () => {
    return (
      <div className={styles.generator_cards_wrapper}>
        {userGenerators.length
          ? mapGenerators()
          : "Add some generators to view them here"}
      </div>
    );
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.greeting}>
        <h1>Heyoo, {props.user.username}!</h1>
      </div>
      <Link to="/generator/new">
        <Button text="Schedule New Generator" clickHandler={handleModal} />
      </Link>
      <hr />
      <SpinnerOrComponent
        isLoading={isLoading}
        componentRenderer={generatorsRenderer}
      />
    </div>
  );
};

export default Dashboard;
