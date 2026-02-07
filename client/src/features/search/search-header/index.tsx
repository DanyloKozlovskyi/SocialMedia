import { KeyboardEvent } from "react";
import { ArrowBack } from "@shared/ui/arrow-back";
import SearchIcon from "@assets/layout/bottom-navigation-bar/search.svg";
import styles from "./search-header.module.scss";

type Props = {
  selectedTab: "users" | "posts";
  onTabChange: (tab: "users" | "posts") => void;
  onBack?: () => void;
  inputValue: string;
  onInputChange: (value: string) => void;
  onSearch: () => void;
  placeholder?: string;
};

const SearchHeader = ({
  selectedTab,
  onTabChange,
  onBack,
  inputValue,
  onInputChange,
  onSearch,
  placeholder = "Search",
}: Props) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchRow}>
        <ArrowBack onBack={onBack} className={styles.backButton} />
        <div className={styles.searchBox}>
          <SearchIcon width={18} height={18} className={styles.searchIcon} />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={styles.input}
          />
        </div>
      </div>

      <div className={styles.tabs}>
        <button
          onClick={() => onTabChange("posts")}
          className={`${styles.tab} ${
            selectedTab === "posts" ? styles.active : ""
          }`}
        >
          Posts
        </button>
        <button
          onClick={() => onTabChange("users")}
          className={`${styles.tab} ${
            selectedTab === "users" ? styles.active : ""
          }`}
        >
          Users
        </button>
      </div>
    </div>
  );
};

export default SearchHeader;
