"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { fetchPosts, fetchUniversityPosts } from "./helpers";
import BlogPost from "@core-components/blog-post";
import NoResultsFound from "@shared/ui/no-results-found";
import SeparatorLayout from "@app/layout/separator-layout";
import Loader from "@shared/ui/loader";
import Separator from "@shared/ui/separator";
import { useHomeStore } from "./useHomeStore";
import { useUniversityStore } from "@entities/university";
import { UniversityModeToggle } from "@features/university-mode";
import { UniversityChatPanel } from "@features/university-chat";
import classes from "./home.module.scss";

const Home = () => {
  const { posts, setPosts, scrollY, setScrollY, page, incrementPage } =
    useHomeStore();
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const {
    isUniversityMode,
    scope,
    universityDomain,
    facultyCode,
  } = useUniversityStore();

  // Track previous mode/scope to reset feed on change
  const prevModeRef = useRef({ isUniversityMode, scope });

  const pageSize = 5;

  const loadPostsForMode = useCallback(
    async (pageNum: number) => {
      if (isUniversityMode && universityDomain) {
        const fc = scope === "faculty" ? facultyCode : null;
        return fetchUniversityPosts(universityDomain, fc, pageNum, pageSize);
      }
      return fetchPosts(pageNum, pageSize);
    },
    [isUniversityMode, scope, universityDomain, facultyCode],
  );

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
    [isLoading, hasMore],
  );

  const loadMore = async () => {
    setIsLoading(true);
    const newPosts = await loadPostsForMode(page);

    if (newPosts?.length < pageSize) setHasMore(false);
    setPosts([...posts, ...newPosts]);
    incrementPage();
    requestAnimationFrame(() => {
      setIsLoading(false);
    });
  };

  // Reset feed when mode/scope changes
  useEffect(() => {
    const prev = prevModeRef.current;
    if (
      prev.isUniversityMode !== isUniversityMode ||
      prev.scope !== scope
    ) {
      prevModeRef.current = { isUniversityMode, scope };
      // Reset and reload
      setPosts([]);
      setHasMore(true);
      // Page will be reset in the initial fetch effect
    }
  }, [isUniversityMode, scope]);

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        setIsLoading(true);
        const initialPosts = await loadPostsForMode(1);
        if (initialPosts?.length > 0) {
          setPosts(initialPosts);
          incrementPage();
        } else {
          setPosts([]);
        }
      } finally {
        requestAnimationFrame(() => {
          setIsLoading(false);
        });
      }
    };

    if (posts?.length === 0) {
      fetchInitial();
    } else {
      window.scrollTo(0, scrollY);
    }

    return () => {
      setScrollY(window.scrollY);
    };
  }, [posts?.length === 0, loadPostsForMode]);

  return (
    <SeparatorLayout>
      <div style={{ overflow: "auto", height: "100%" }}>
        {/* University mode toggle + chat panel */}
        <div style={{ padding: "12px 16px 0" }}>
          <UniversityModeToggle />
          <UniversityChatPanel />
        </div>

        {posts?.map((item, index) => {
          const isLast = index === posts.length - 1;
          return (
            <div
              key={index}
              ref={isLast ? lastPostRef : null}
              style={{ position: "relative" }}
            >
              <BlogPost key={item?.id} className={classes.blogPost} {...item} />
              {index !== posts?.length - 1 && (
                <Separator horizontal top="100%" />
              )}
            </div>
          );
        })}
        {isLoading && posts.length === 0 && (
          <div className={classes.loaderWrapperTop}>
            <Loader isLoading />
          </div>
        )}

        {posts?.length > 0 && isLoading && (
          <div className={classes.loaderWrapperBottom}>
            <Loader isLoading />
          </div>
        )}

        {!hasMore && (
          <NoResultsFound
            label={
              isUniversityMode
                ? "No more posts from your university."
                : "No more recommended posts for now."
            }
          />
        )}
      </div>
    </SeparatorLayout>
  );
};

export default Home;
