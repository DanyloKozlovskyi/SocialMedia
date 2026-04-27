"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useIntl } from "react-intl";
import { useState, useEffect, KeyboardEvent } from "react";
import SearchIcon from "@assets/layout/bottom-navigation-bar/search.svg";
import { filterUsers, User } from "@entities/user";
import { UserLogo } from "@core-components/user-logo";
import classes from "./search-component.module.scss";

const SearchComponent = () => {
  const router = useRouter();
  const params = useSearchParams();
  const queryValue = params.get("query") ?? "";
  const section = params.get("s") ?? "posts";
  const intl = useIntl();

  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState(queryValue);
  const [showResults, setShowResults] = useState(false);
  const searchDelay = 300;
  const openDelay = 200;

  const [results, setResults] = useState<User[]>([]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const fetchResults = async () => {
        if (query.trim().length > 0) {
          try {
            const data = await filterUsers(query, 1, 100);
            setResults(data);
            setShowResults(true);
          } catch (err) {
            console.log(err);
            setResults([]);
            setShowResults(false);
          }
        } else {
          setResults([]);
          setShowResults(false);
        }
      };

      fetchResults();
    }, searchDelay);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const goToUserPosts = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    userId: string
  ) => {
    e.stopPropagation();
    router.push(`/user-posts?id=${userId}`);
  };

  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;

    if (query) {
      router.push(`search?query=${query}&s=${section}`);
    } else {
      router.push(`home`);
    }
  };

  return (
    <div className={classes.searchComponent}>
      <SearchIcon width={20} height={20} />
      <input
        placeholder={intl.formatMessage({
          id: "search-input.placeholder",
        })}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowResults(e.target.value.length > 0);
        }}
        onBlur={() => setTimeout(() => setIsFocused(false), openDelay)} // delay so you can click items
        onFocus={() => setIsFocused(true)}
        onKeyDown={handleKeyDown}
      />
      {showResults && isFocused && (
        <div className={classes.searchResults}>
          {results.map((item, idx) => (
            <div
              key={idx}
              className={classes.searchResultItem}
              onClick={(e) => goToUserPosts(e, item?.id)}
            >
              <UserLogo
                className={classes.icon}
                logoKey={item?.logoKey}
                size={20}
              />
              <p>{item?.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
