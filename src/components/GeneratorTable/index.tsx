import GeneratorRow from "./GeneratorRow";
import styles from "./style.module.scss";
import { GeneratorTableProps } from "./types";

const GeneratorTable = (props: GeneratorTableProps) => {
  const populateTableRows = () => {
    return props.generators.map((generator) => {
      return <GeneratorRow generator={generator} key={generator.id} />;
    });
  };
  return (
    <table className={styles.table}>
      <thead>
        <tr className={styles.header_row}>
          <th></th>
          <th>Generator Name</th>
          <th>Frequency</th>
          <th>Generate Now</th>
        </tr>
      </thead>
      <tbody>{populateTableRows()}</tbody>
    </table>
  );
};

export default GeneratorTable;
