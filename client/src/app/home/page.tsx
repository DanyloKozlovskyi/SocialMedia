"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { fetchPosts } from "./helpers";
import BlogPost from "@core-components/blog-post";
import { CreatePostModal, CreatePostButton } from "@features/create-post";
import NoResultsFound from "@shared/ui/no-results-found";
import SeparatorLayout from "@app/layout/separator-layout";
import Loader from "@shared/ui/loader";
import Separator from "@shared/ui/separator";
import { useHomeStore } from "./useHomeStore";
import classes from "./home.module.scss";

const Home = () => {
  const { posts, setPosts, scrollY, setScrollY, page, incrementPage } =
    useHomeStore();
  const timeout = 1000;
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const width = 500;
  const height = 650;

  const pageSize = 5;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, timeout);
  };

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
    [isLoading, hasMore]
  );

  const loadMore = async () => {
    setIsLoading(true);
    const newPosts = await fetchPosts(page, pageSize, width, height);

    if (newPosts?.length < pageSize) setHasMore(false);
    setPosts([...posts, ...newPosts]);
    incrementPage();
    requestAnimationFrame(() => {
      setIsLoading(false);
    });
  };

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        setIsLoading(true);
        const initialPosts = await fetchPosts(page, pageSize, width, height);
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
  }, []);

  return (
    <SeparatorLayout>
      <CreatePostButton onClick={() => setIsOpen(true)} />
      <div style={{ overflow: "auto", height: "100%" }}>
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
        <CreatePostModal
          isOpen={isOpen}
          onClose={handleClose}
          timeout={timeout}
          isClosing={isClosing}
        />
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
          <NoResultsFound label="No more recommended posts for now." />
        )}
      </div>
    </SeparatorLayout>
  );
};

export default Home;
