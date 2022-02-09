import "./style.scss";
import { TabBarProps } from "./types";

const TabBar = (props: TabBarProps) => {
  const renderTabs = () => {
    return props.tabs.map((tab: string) => {
      const isSelected = tab === props.selectedTab ? "selected" : "";
      return (
        <div
          className={`${isSelected} tab`}
          onClick={() => props.handleTabClick(tab)}
          key={tab}
        >
          {tab}
        </div>
      );
    });
  };

  return <div className="wrapper">{renderTabs()}</div>;
};

export default TabBar;
