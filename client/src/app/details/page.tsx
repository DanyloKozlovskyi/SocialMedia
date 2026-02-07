"use client";
import {
  useEffect,
  useCallback,
  useRef,
  useLayoutEffect,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";
import { getParents } from "@entities/blog-post";
import BlogPost from "@core-components/blog-post";
import { CreatePostModal, CreatePostButton } from "@features/create-post";
import PageHeader from "@shared/ui/page-header";
import SeparatorLayout from "@app/layout/separator-layout";
import Loader from "@shared/ui/loader";
import Separator from "@shared/ui/separator";
import NoResultsFound from "@shared/ui/no-results-found";
import { fetchMainPost, fetchSecondaryPosts, fetchComments } from "./helpers";
import { useDetailsStore } from "./useDetailsStore";
import classes from "./details.module.scss";

const Details = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id")!;
  const timeout = 1000;

  const {
    isLoadingPost,
    isLoadingComments,

    pushView,
    popView,
    updateScrollY,

    appendComments,
    incrementCommentsPage,
    setCommentsHasMore,
    setIsLoadingComments,

    setIsLoadingPost,
  } = useDetailsStore();

  const post = useDetailsStore(
    (state) => state.stack[state.currentIndex]?.post || null,
  );
  const parents = useDetailsStore(
    (state) => state.stack[state.currentIndex]?.parents || null,
  );
  const comments = useDetailsStore(
    (state) => state.stack[state.currentIndex]?.comments || null,
  );
  const commentsPage = useDetailsStore(
    (state) => state.stack[state.currentIndex]?.commentsPage || 1,
  );
  const commentsHasMore = useDetailsStore(
    (state) => state.stack[state.currentIndex]?.commentsHasMore ?? true,
  );
  const scrollY = useDetailsStore(
    (state) => state.stack[state.currentIndex]?.scrollY ?? 0,
  );

  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const commentObserver = useRef<IntersectionObserver | null>(null);
  const pageSize = 5;

  useLayoutEffect(() => {
    // whenever `id` changes, clear out the old post+comments
    if (post?.id === id) return;
    pushView(null, [], []);
  }, [id]);

  useEffect(() => {
    const initialize = async () => {
      setIsLoadingPost(true);
      setIsLoadingComments(true);
      const main = await fetchMainPost(id);
      const allParents = await fetchSecondaryPosts(getParents, main.id);
      const comments = await fetchComments(id, 1, pageSize);
      // clear empty stackelement pushed inside of useLayoutEffect
      popView();
      pushView(main, comments, allParents);
      incrementCommentsPage();
      requestAnimationFrame(() => {
        setIsLoadingComments(false);
        setIsLoadingPost(false);
      });
    };
    if (id !== post?.id) {
      initialize();
    }
  }, [id]);

  // restore scroll position
  useLayoutEffect(() => {
    if (comments || post) {
      window.scrollTo(0, scrollY);
    }
  }, []);

  const loadMoreComments = useCallback(async () => {
    if (!post || isLoadingComments || !commentsHasMore) return;
    setIsLoadingComments(true);
    const data = await fetchComments(post.id, commentsPage, pageSize);
    if (data?.length < 5) setCommentsHasMore(false);
    appendComments(data);
    incrementCommentsPage();
    requestAnimationFrame(() => setIsLoadingComments(false));
  }, [post, isLoadingComments, commentsHasMore, commentsPage]);

  const lastCommentRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoadingComments || !commentsHasMore) return;
      if (commentObserver.current) commentObserver.current.disconnect();
      commentObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) loadMoreComments();
      });
      if (node) commentObserver.current.observe(node);
    },
    [isLoadingComments, commentsHasMore, loadMoreComments],
  );

  useEffect(() => () => updateScrollY(window.scrollY), [updateScrollY]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, timeout);
  };

  return (
    <SeparatorLayout>
      <PageHeader title="Post" onBack={() => popView()} />
      <div style={{ overflow: "auto", height: "100%" }}>
        {!isLoadingPost &&
          parents?.map((post) => {
            return <BlogPost key={post.id} {...post} />;
          })}

        {/* main post */}
        {!isLoadingPost &&
          post &&
          (() => {
            return <BlogPost {...post} />;
          })()}
        <Separator horizontal top="100%" />

        {/* comments infinite scroll */}
        {!isLoadingPost &&
          comments?.map((comment, i) => {
            const last = i === comments?.length - 1;
            return (
              <div key={comment.id} ref={last ? lastCommentRef : null}>
                <BlogPost {...comment} />
              </div>
            );
          })}

        {(isLoadingPost || isLoadingComments) &&
          (!comments || comments?.length == 0) && (
            <div className={classes.loaderWrapperTop}>
              <Loader isLoading />
            </div>
          )}

        {isLoadingComments && comments?.length > 0 && (
          <div className={classes.loaderWrapperBottom}>
            <Loader isLoading />
          </div>
        )}
        {!commentsHasMore && (
          <NoResultsFound label="No more comments for this post." />
        )}

        <CreatePostButton onClick={() => setIsOpen(true)} />
        <CreatePostModal
          isOpen={isOpen}
          onClose={handleClose}
          timeout={timeout}
          isClosing={isClosing}
          parentId={id}
        />
      </div>
    </SeparatorLayout>
  );
};

export default Details;
