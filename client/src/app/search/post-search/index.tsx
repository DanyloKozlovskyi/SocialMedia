"use client";
import {
  useEffect,
  useState,
  useCallback,
  useRef,
  useLayoutEffect,
} from "react";
import { filterPosts } from "@entities/blog-post";
import BlogPost from "@core-components/blog-post";
import Separator from "@shared/ui/separator";
import Loader from "@shared/ui/loader";
import NoResultsFound from "@shared/ui/no-results-found";
import { usePostSearchStore } from "./usePostSearchStore";
import classes from "./post-search.module.scss";

interface PostSearchProps {
  className?: string;
  query: string;
}

const PostSearch = ({ className, query }: PostSearchProps) => {
  const normalizedQuery = query.trim().toLowerCase();
  const {
    posts,
    lastQuery,
    page,
    hasMore,
    scrollY,
    setPosts,
    appendPosts,
    clearPosts,
    setLastQuery,
    setPage,
    setHasMore,
    setScrollY,
  } = usePostSearchStore();

  const [isLoading, setLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const pageSize = 5;

  const loadPosts = useCallback(
    async (loadNext = false) => {
      if (isLoading || (loadNext && !hasMore)) return;
      setLoading(true);
      try {
        const result = await filterPosts(
          normalizedQuery,
          loadNext ? page : 1,
          pageSize,
        );
        if (!loadNext) {
          setPosts(result, normalizedQuery);
        } else {
          appendPosts(result);
        }
        setHasMore(result.length === pageSize);
        setLastQuery(normalizedQuery);
        setPage(loadNext ? page + 1 : 2);
      } catch (err) {
        console.error("Failed to search posts:", err);
        if (!loadNext) clearPosts();
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [normalizedQuery, page, hasMore, isLoading],
  );

  useLayoutEffect(() => {
    if (!normalizedQuery) {
      clearPosts();
      setHasMore(false);
      setPage(1);
      return;
    }
    if (normalizedQuery !== lastQuery) {
      clearPosts();
      setHasMore(false);
      setPage(1);
      loadPosts(false);
    }
  }, [normalizedQuery]);

  useEffect(() => {
    return () => {
      if (window.scrollY !== 0) setScrollY(window.scrollY);
    };
  }, []);

  useLayoutEffect(() => {
    if (posts?.length > 0)
      requestAnimationFrame(() => window.scrollTo(0, scrollY));
  }, []);

  // Infinite scroll observer
  const lastPostRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          loadPosts(true);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, loadPosts],
  );

  return (
    <div className={`${className} ${classes.postsResults}`}>
      {posts.map((post, idx) => {
        const isLast = idx === posts.length - 1;
        return (
          <div
            key={post.id}
            ref={isLast ? lastPostRef : null}
            style={{ position: "relative" }}
          >
            <BlogPost className={classes.blogPost} {...post} />
            {idx !== posts.length - 1 && <Separator horizontal top="100%" />}
          </div>
        );
      })}
      <Loader
        isLoading={isLoading}
        className={
          posts?.length > 0
            ? classes.loaderWrapperBottom
            : classes.loaderWrapperTop
        }
      />
      {!hasMore && !isLoading && (
        <NoResultsFound
          label={posts?.length > 0 ? "No more posts." : "No posts found."}
        />
      )}
    </div>
  );
};

export default PostSearch;
