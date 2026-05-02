import { useAccountStore } from "@app/account/useAccountStore";
import { useHomeStore } from "@app/home/useHomeStore";
import { useDetailsStore } from "@app/details/useDetailsStore";
import { usePostSearchStore } from "@app/search/post-search/usePostSearchStore";
import { useUserSearchStore } from "@app/search/user-search/useUserSearchStore";
import { useUserPostsStore } from "@app/user-posts/useUserPostsStore";
import { useChatStore } from "@features/chat/model/store";
import { useUniversityStore } from "@entities/university/store";

export const wipeAllStores = () => {
  useAccountStore.setState({
    posts: [],
    scrollY: 0,
    page: 1,
    hasMore: true,
    userId: "",
    logoKey: null,
    description: "",
    name: "",
  });

  useHomeStore.setState({
    posts: [],
    scrollY: 0,
    page: 1,
  });

  useDetailsStore.setState({
    stack: [],
    currentIndex: -1,
    isLoadingPost: false,
    isLoadingComments: false,
  });

  usePostSearchStore.setState({
    posts: [],
    lastQuery: "",
    page: 1,
    hasMore: true,
    scrollY: 0,
  });

  useUserSearchStore.setState({
    users: [],
    lastQuery: "",
    page: 1,
    hasMore: true,
    scrollY: 0,
  });

  useUserPostsStore.setState({
    stack: [],
    currentIndex: -1,
    isLoading: false,
  });

  useChatStore.setState({
    connection: null,
    conversations: [],
    activeConversationId: null,
    messages: [],
    isConnected: false,
    isLoading: false,
    hasMore: true,
    isFetchingOlder: false,
    widgetState: "collapsed",
  });

  useUniversityStore.persist.clearStorage();
  useUniversityStore.setState({
    isUniversityMode: false,
    scope: "university",
    universityDomain: null,
    universityName: null,
    facultyCode: null,
    facultyName: null,
    onboardingDismissed: false,
  });
};
