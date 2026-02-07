"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { getPersonalInfo, getUserId } from "@entities/user";
import { EditProfileButton } from "@features/edit-profile";
import { UserLogo } from "@core-components/user-logo";
import PageHeader from "@shared/ui/page-header";
import Loader from "@shared/ui/loader";
import Separator from "@shared/ui/separator";
import BlogPost from "@core-components/blog-post";
import { fetchUserPosts } from "@entities/blog-post/helpers";
import NoResultsFound from "@shared/ui/no-results-found";
import SeparatorLayout from "../layout/separator-layout";
import { useAccountStore } from "./useAccountStore";
import classes from "./account.module.scss";

const Account = () => {
  const {
    posts,
    scrollY,
    page,
    hasMore,

    setPosts,
    appendPosts,
    setScrollY,
    incrementPage,
    setHasMore,

    userId,
    setUserId,
    logoKey,
    setLogoKey,
    description,
    setDescription,
    name,
    setName,
  } = useAccountStore();

  const [isLoading, setIsLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const pageSize = 5;

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getUserId();
      setUserId(id);
    };
    if (!userId) {
      fetchUserId();
    }
  }, [userId, setUserId]);

  useEffect(() => {
    const fetchInfo = async () => {
      const info = await getPersonalInfo();
      setLogoKey(info.logoKey);
      setName(info.name);
      setDescription(info.description ?? "");
    };

    if (!logoKey && !name && !description) {
      fetchInfo();
    }
  }, [logoKey, name, description, setLogoKey, setName, setDescription]);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore || !userId) return;
    setIsLoading(true);

    const nextPosts = await fetchUserPosts(page, pageSize, userId);
    if (nextPosts.length < pageSize) {
      setHasMore(false);
    }
    appendPosts(nextPosts);
    incrementPage();
    requestAnimationFrame(() => setIsLoading(false));
  }, [
    isLoading,
    hasMore,
    page,
    pageSize,
    userId,
    appendPosts,
    incrementPage,
    setHasMore,
  ]);

  useEffect(() => {
    const fetchInitial = async () => {
      setIsLoading(true);

      const initialPosts = await fetchUserPosts(page, pageSize, userId);

      if (initialPosts.length > 0) {
        setPosts(initialPosts);
        incrementPage();
      } else {
        setPosts([]);
        setHasMore(false);
      }

      requestAnimationFrame(() => setIsLoading(false));
    };
    if (userId && posts?.length === 0) {
      fetchInitial();
    }
  }, [userId]);

  useEffect(() => {
    if (posts.length > 0) {
      window.scrollTo(0, scrollY);
    }
    return () => {
      setScrollY(window.scrollY);
    };
  }, [scrollY]);

  // intersection observer on the last post
  const lastPostRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading || !hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, loadMore],
  );

  return (
    <div className={classes.accountWrapper}>
      <SeparatorLayout>
        <PageHeader title="Profile" />

        <div className={classes.accountHeader}>
          <UserLogo className={classes.userLogo} logoKey={logoKey} />
          <div className={classes.userName}>{name}</div>
          <div className={classes.description}>{description}</div>
          <EditProfileButton
            logoKey={logoKey ?? ""}
            description={description}
            name={name}
          />
        </div>

        <div style={{ overflow: "auto", height: "100%" }}>
          {posts.map((item, idx) => {
            const isLast = idx === posts.length - 1;
            return (
              <div
                key={item.id}
                ref={isLast ? lastPostRef : null}
                style={{ position: "relative" }}
              >
                <BlogPost className={classes.blogPost} {...item} />
                {idx < posts.length - 1 && <Separator horizontal top="100%" />}
              </div>
            );
          })}

          {isLoading && posts.length === 0 && (
            <div className={classes.loaderWrapperTop}>
              <Loader isLoading />
            </div>
          )}
          {isLoading && posts.length > 0 && (
            <div className={classes.loaderWrapperBottom}>
              <Loader isLoading />
            </div>
          )}

          {!hasMore && <NoResultsFound label="No more posts to show." />}
        </div>
      </SeparatorLayout>
    </div>
  );
};

export default Account;
