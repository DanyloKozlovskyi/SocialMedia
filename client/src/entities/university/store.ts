import { create } from "zustand";
import { persist } from "zustand/middleware";

type UniversityModeScope = "university" | "faculty";

interface UniversityStoreState {
  // Whether the user is in university mode
  isUniversityMode: boolean;
  // "university" = all uni posts, "faculty" = only same faculty
  scope: UniversityModeScope;
  // Cached user university info
  universityDomain: string | null;
  universityName: string | null;
  facultyCode: string | null;
  facultyName: string | null;
  major: string | null;
  majorKey: string | null;
  yearOfStudy: number | null;
  // Whether onboarding has been completed or dismissed
  onboardingDismissed: boolean;

  // Actions
  setUniversityMode: (enabled: boolean) => void;
  setScope: (scope: UniversityModeScope) => void;
  setUniversityInfo: (info: {
    universityDomain: string | null;
    universityName: string | null;
    facultyCode: string | null;
    facultyName: string | null;
    major?: string | null;
    majorKey?: string | null;
    yearOfStudy?: number | null;
  }) => void;
  clearUniversityInfo: () => void;
  setOnboardingDismissed: (dismissed: boolean) => void;
}

export const useUniversityStore = create<UniversityStoreState>()(
  persist(
    (set) => ({
      isUniversityMode: false,
      scope: "university",
      universityDomain: null,
      universityName: null,
      facultyCode: null,
      facultyName: null,
      major: null,
      majorKey: null,
      yearOfStudy: null,
      onboardingDismissed: false,

      setUniversityMode: (enabled) => set({ isUniversityMode: enabled }),
      setScope: (scope) => set({ scope }),
      setUniversityInfo: (info) =>
        set({
          universityDomain: info.universityDomain,
          universityName: info.universityName,
          facultyCode: info.facultyCode,
          facultyName: info.facultyName,
          major: info.major ?? null,
          majorKey: info.majorKey ?? null,
          yearOfStudy: info.yearOfStudy ?? null,
        }),
      clearUniversityInfo: () =>
        set({
          universityDomain: null,
          universityName: null,
          facultyCode: null,
          facultyName: null,
          major: null,
          majorKey: null,
          yearOfStudy: null,
          isUniversityMode: false,
          onboardingDismissed: false,
        }),
      setOnboardingDismissed: (dismissed) =>
        set({ onboardingDismissed: dismissed }),
    }),
    {
      name: "university-store",
    },
  ),
);
