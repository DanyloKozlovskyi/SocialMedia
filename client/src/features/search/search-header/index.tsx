import { ArrowBack } from "@shared/ui/arrow-back";
import styles from "./search-header.module.scss";

type Props = {
  selectedTab: "users" | "posts";
  onTabChange: (tab: "users" | "posts") => void;
  onBack?: () => void;
};

const SearchHeader = ({ selectedTab, onTabChange, onBack }: Props) => {
  return (
    <div className={styles.container}>
      <ArrowBack onBack={onBack} className={styles.backButton} />

      <div className={styles.tabs}>
        <button
          onClick={() => onTabChange("users")}
          className={`${styles.tab} ${
            selectedTab === "users" ? styles.active : ""
          }`}
        >
          Users
        </button>
        <button
          onClick={() => onTabChange("posts")}
          className={`${styles.tab} ${
            selectedTab === "posts" ? styles.active : ""
          }`}
        >
          Posts
        </button>
      </div>
    </div>
  );
};

export default SearchHeader;
