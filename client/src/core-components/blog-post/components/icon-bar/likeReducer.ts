interface LikeState {
  liked: boolean;
  count: number;
}

type LikeAction = { type: "TOGGLE_LIKE" };

function likeReducer(state: LikeState, action: LikeAction): LikeState {
  switch (action.type) {
    case "TOGGLE_LIKE": {
      const nextLiked = !state.liked;
      return {
        liked: nextLiked,
        count: state.count + (nextLiked ? 1 : -1),
      };
    }

    default:
      return state;
  }
}

export { likeReducer };
