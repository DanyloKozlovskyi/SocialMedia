"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import SeparatorLayout from "@app/layout/separator-layout";
import PageHeader from "@shared/ui/page-header";
import Loader from "@shared/ui/loader";
import NoResultsFound from "@shared/ui/no-results-found";
import UserCard from "@core-components/user-card";
import { getFollowing, User } from "@entities/user";
import { useDetailsStore } from "@app/details/useDetailsStore";
import classes from "./following.module.scss";

const FollowingPage = () => {
  const params = useParams();
  const userId = params.userId as string;
  const { popView } = useDetailsStore();

  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const pageSize = 20;

  const loadUsers = useCallback(
    async (isNext = false) => {
      if (isLoading || (!hasMore && isNext)) return;
      setIsLoading(true);
      try {
        const result = await getFollowing(userId, isNext ? page : 1, pageSize);
        if (!isNext) {
          setUsers(result);
        } else {
          setUsers((prev) => [...prev, ...result]);
        }
        setHasMore(result.length === pageSize);
        setPage(isNext ? page + 1 : 2);
      } catch (err) {
        console.error("Error fetching following", err);
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    },
    [userId, page, hasMore, isLoading],
  );

  useEffect(() => {
    loadUsers(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

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
    <SeparatorLayout>
      <PageHeader title="Following" onBack={() => popView()} />
      <div className={classes.container}>
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
            label={
              users.length > 0 ? "No more users." : "Not following anyone yet."
            }
          />
        )}
      </div>
    </SeparatorLayout>
  );
};

export default FollowingPage;
