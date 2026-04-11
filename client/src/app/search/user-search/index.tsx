"use client";
import {
  useEffect,
  useState,
  useCallback,
  useRef,
  useLayoutEffect,
} from "react";
import NoResultsFound from "@shared/ui/no-results-found";
import Loader from "@shared/ui/loader";
import { filterUsers } from "@entities/user";
import UserCard from "@core-components/user-card";
import classes from "./user-search.module.scss";
import { useUserSearchStore } from "./useUserSearchStore";

interface SearchUserProps {
  className?: string;
  query: string;
}

const UserSearch = ({ className, query }: SearchUserProps) => {
  const normalizedQuery = query.trim().toLowerCase();
  const {
    users,
    lastQuery,
    page,
    hasMore,
    scrollY,
    setUsers,
    appendUsers,
    clearUsers,
    setLastQuery,
    setScrollY,
    setPage,
    setHasMore,
  } = useUserSearchStore();

  const [isLoading, setLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const pageSize = 5;

  const loadUsers = useCallback(
    async (isNext = false) => {
      if (isLoading || (!hasMore && isNext)) return;
      setLoading(true);
      try {
        const result = await filterUsers(
          normalizedQuery,
          isNext ? page : 1,
          pageSize,
        );
        if (!isNext) {
          setUsers(result, normalizedQuery);
        } else {
          appendUsers(result);
        }
        setHasMore(result.length === pageSize);
        setLastQuery(normalizedQuery);
        setPage(isNext ? page + 1 : 2);
      } catch (err) {
        console.error("Error fetching users", err);
        if (!isNext) clearUsers();
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [normalizedQuery, page, hasMore, isLoading],
  );

  useLayoutEffect(() => {
    if (!normalizedQuery) {
      clearUsers();
      setHasMore(false);
      setPage(1);
      return;
    }
    if (normalizedQuery !== lastQuery) {
      clearUsers();
      setHasMore(false);
      setPage(1);
      loadUsers(false);
    }
  }, [normalizedQuery]);

  useEffect(() => {
    window.scrollTo(0, scrollY);
    return () => {
      if (window.scrollY !== 0) setScrollY(window.scrollY);
    };
  }, []);

  const lastUserRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          loadUsers(true);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, loadUsers],
  );

  return (
    <div className={`${className} ${classes.postsResults}`}>
      {users.map((user, idx) => {
        const isLast = idx === users.length - 1;
        return (
          <div key={user.id} ref={isLast ? lastUserRef : null}>
            <UserCard user={user} />
          </div>
        );
      })}
      <Loader
        isLoading={isLoading}
        className={
          users.length > 0
            ? classes.loaderWrapperBottom
            : classes.loaderWrapperTop
        }
      />
      {!hasMore && !isLoading && (
        <NoResultsFound
          label={users.length > 0 ? "No more users." : "No users found."}
        />
      )}
    </div>
  );
};

export default UserSearch;
