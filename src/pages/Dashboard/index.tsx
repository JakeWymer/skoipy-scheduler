import { useState, useEffect } from "react";
import axios from "axios";
import Button from "../../components/Button";
import Modal from "react-modal";
import { Generator } from "./types";
import GeneratorCard from "../../components/GeneratorCard";
import styles from "./style.module.scss";
import { Link } from "react-router-dom";

const Dashboard = () => {
  Modal.setAppElement("#root");
  const [modalIsOpen, setModalIsOpen] = useState(false);
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
      <Link to="/generator/new">
        <Button text="Schedule New Generator" clickHandler={handleModal} />
      </Link>
      <hr />
      <div className={styles.generator_cards_wrapper}>{mapGenerators()}</div>
    </div>
  );
};

export default Dashboard;
