"use client";
import { useEffect, useRef, useCallback, useLayoutEffect } from "react";
import { useSearchParams } from "next/navigation";
import SeparatorLayout from "../layout/separator-layout";
import { getUserInfo } from "@entities/user";
import { UserLogo } from "@core-components/user-logo";
import PageHeader from "@shared/ui/page-header";
import Separator from "@shared/ui/separator";
import BlogPost from "@core-components/blog-post";
import Loader from "@shared/ui/loader";
import NoResultsFound from "@shared/ui/no-results-found";
import { fetchUserPosts } from "@entities/blog-post/helpers";
import { useUserPostsStore } from "./useUserPostsStore";
import classes from "./user-posts.module.scss";

const UserPosts = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "";

  const isLoading = useUserPostsStore((state) => state.isLoading);
  const posts = useUserPostsStore(
    (state) => state.stack[state.currentIndex]?.posts || null,
  );
  const logoKey = useUserPostsStore(
    (state) => state.stack[state.currentIndex]?.logoKey || "",
  );
  const userId = useUserPostsStore(
    (state) => state.stack[state.currentIndex]?.userId || "",
  );
  const name = useUserPostsStore(
    (state) => state.stack[state.currentIndex]?.name || "",
  );
  const description = useUserPostsStore(
    (state) => state.stack[state.currentIndex]?.description || "",
  );
  const postsPage = useUserPostsStore(
    (state) => state.stack[state.currentIndex]?.postsPage || 1,
  );
  const postsHasMore = useUserPostsStore(
    (state) => state.stack[state.currentIndex]?.postsHasMore,
  );

  const {
    currentView,
    pushView,
    popView,
    updateScrollY,
    appendPosts,
    incrementPostsPage,
    setPostsHasMore,
    setIsLoading,
  } = useUserPostsStore.getState();

  const observer = useRef<IntersectionObserver | null>(null);
  const pageSize = 5;

  useLayoutEffect(() => {
    // whenever `id` changes, add fake post to simulate loading
    if (userId === id) return;
    pushView({
      userId: "",
      name: "",
      description: "",
      logoKey: "",
      posts: [],
      postsPage: 1,
      postsHasMore: true,
      scrollY: 0,
    });
  }, [id]);

  useEffect(() => {
    const view = currentView();
    const loadInitial = async () => {
      setIsLoading(true);
      const newPosts = await fetchUserPosts(1, pageSize, id);
      const userInfo = await getUserInfo(id);
      popView();
      pushView({
        userId: userInfo?.id ?? "",
        name: userInfo?.name ?? "",
        description: userInfo?.description ?? "",
        logoKey: userInfo?.logoKey ?? "",
        posts: newPosts,
        postsPage: 2,
        postsHasMore: newPosts.length === pageSize,
        scrollY: 0,
      });
      requestAnimationFrame(() => setIsLoading(false));
    };

    if (!view || view.userId !== id) {
      loadInitial();
    } else {
      window.scrollTo(0, view.scrollY);
    }
  }, [id]);

  useLayoutEffect(() => {
    if (posts) {
      window.scrollTo(0, scrollY);
    }
  }, []);

  useEffect(() => {
    return () => updateScrollY(window.scrollY);
  }, []);

  const loadMore = useCallback(async () => {
    if (!postsHasMore || isLoading) return;
    setIsLoading(true);
    const data = await fetchUserPosts(postsPage, pageSize, id);
    if (data.length < pageSize) setPostsHasMore(false);
    appendPosts(data);
    incrementPostsPage();
    requestAnimationFrame(() => setIsLoading(false));
  }, [id, isLoading, postsHasMore, postsPage]);

  const lastPostRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading || !postsHasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) loadMore();
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, postsHasMore, loadMore],
  );

  return (
    <SeparatorLayout>
      <div style={{ height: "100%" }}>
        <PageHeader title="Posts" onBack={() => popView()} />
        {logoKey != "" && (
          <div className={classes.accountHeader}>
            <UserLogo className={classes.userLogo} logoKey={logoKey} />
            <div className={classes.userName}>{name}</div>
            <div className={classes.description}>{description}</div>
          </div>
        )}
        {posts?.map((item, index) => (
          <div
            key={item.id}
            ref={index === posts.length - 1 ? lastPostRef : null}
            style={{ position: "relative" }}
          >
            {index === 0 && <Separator horizontal top="0" />}
            <BlogPost className={classes.blogPost} {...item} />
            {index !== posts.length - 1 && <Separator horizontal top="100%" />}
          </div>
        ))}
        <Loader
          isLoading={isLoading}
          className={
            !posts || posts?.length == 0
              ? classes.loaderWrapperTop
              : classes.loaderWrapperBottom
          }
        />
        {!postsHasMore && <NoResultsFound label="No more posts." />}
      </div>
    </SeparatorLayout>
  );
};

export default UserPosts;
