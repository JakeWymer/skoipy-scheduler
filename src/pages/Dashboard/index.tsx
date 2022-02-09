import { useState, useEffect } from "react";
import Button from "../../components/Button";
import { Generator, GeneratorResponse } from "./types";
import styles from "./style.module.scss";
import { Link } from "react-router-dom";
import { AuthProps } from "../../AuthedRoute";
import SpinnerOrComponent from "../../components/SpinnerOrComponent";
import ApiClient from "../../api";
import { ButtonTheme } from "../../components/Button/types";
import GeneratorTable from "../../components/GeneratorTable";

const Dashboard = (props: AuthProps) => {
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

  const tableRenderer = () => {
    return <GeneratorTable generators={userGenerators} />;
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.greeting}>
        <h2>My Generators</h2>
      </div>
      <div className={styles.add_generator}>
        <Link to="/generator/new">
          <Button text="Add Generator" theme={ButtonTheme.BLUE} />
        </Link>
      </div>
      <hr />
      <SpinnerOrComponent
        isLoading={isLoading}
        componentRenderer={tableRenderer}
      />
    </div>
  );
};

export default Dashboard;
