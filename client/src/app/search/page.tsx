"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useIntl } from "react-intl";
import SearchHeader from "src/features/search/search-header";
import SeparatorLayout from "../layout/separator-layout";
import PostSearch from "./post-search";
import UserSearch from "./user-search";

const Search = () => {
  const router = useRouter();
  const params = useSearchParams();
  const intl = useIntl();
  const initialQuery = params.get("query") ?? "";
  const section = (params.get("s") ?? "posts") as "users" | "posts";

  const [inputValue, setInputValue] = useState(initialQuery);
  const [query, setQuery] = useState(initialQuery);

  const updateUrl = (q: string, s: string) => {
    const searchParams = new URLSearchParams();
    if (q) searchParams.set("query", q);
    searchParams.set("s", s);
    router.push(`search?${searchParams.toString()}`);
  };

  const handleSearch = () => {
    const trimmed = inputValue.trim();
    setQuery(trimmed);
    updateUrl(trimmed, section);
  };

  const handleSectionChange = (s: "users" | "posts") => {
    updateUrl(query, s);
  };

  const handlePeripheralComment = (id: string) => {
    router.push(`details?id=${id}&comment=${true}`);
  };

  return (
    <SeparatorLayout>
      <SearchHeader
        selectedTab={section}
        onTabChange={handleSectionChange}
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSearch={handleSearch}
        placeholder={intl.formatMessage({ id: "search-input.placeholder" })}
      />
      {section === "users" ? (
        <UserSearch query={query} />
      ) : (
        <PostSearch query={query} onComment={handlePeripheralComment} />
      )}
    </SeparatorLayout>
  );
};

export default Search;
