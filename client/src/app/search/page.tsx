"use client";
import { useSearchParams, useRouter } from "next/navigation";
import SearchHeader from "src/features/search/search-header";
import SeparatorLayout from "../layout/separator-layout";
import PostSearch from "./post-search";
import UserSearch from "./user-search";

const Search = () => {
  const router = useRouter();
  const params = useSearchParams();
  const query = params.get("query") ?? "";
  const section = params.get("s") ?? "posts";

  const handleSectionChange = (s: "users" | "posts") => {
    if (query) {
      router.push(`search?query=${query}&s=${s}`);
    }
  };

  const handlePeripheralComment = (id: string) => {
    router.push(`details?id=${id}&comment=${true}`);
  };

  return (
    <SeparatorLayout>
      <SearchHeader selectedTab={section} onTabChange={handleSectionChange} />
      {section === "users" ? (
        <UserSearch query={query} />
      ) : (
        <PostSearch query={query} onComment={handlePeripheralComment} />
      )}
    </SeparatorLayout>
  );
};

export default Search;
