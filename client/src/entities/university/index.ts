export { useUniversityStore } from "./store";
export {
  updateUniversityInfo,
  clearUniversityInfo,
  getUniversityPeers,
  getUniversityStats,
  getUniversityPosts,
  updateInterests,
} from "./api";
export type {
  UniversityInfo,
  UniversityPeer,
  UniversityStats,
  UpdateUniversityInfoPayload,
} from "./types";
