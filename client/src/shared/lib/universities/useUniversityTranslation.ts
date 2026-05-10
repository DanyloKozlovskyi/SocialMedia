"use client";

import { useIntl } from "react-intl";
import { UNIVERSITIES } from "./index";

export type ConversationTypeForTranslation = 0 | 1 | 2 | 3 | 4 | 5;

export function useUniversityTranslation() {
  const intl = useIntl();

  const translateUniversity = (domain: string | null | undefined): string => {
    if (!domain) return "";
    const uni = UNIVERSITIES[domain];
    if (!uni) return domain;
    return intl.formatMessage({ id: uni.nameKey, defaultMessage: uni.name });
  };

  const translateFaculty = (
    domain: string | null | undefined,
    facultyCode: string | null | undefined,
  ): string => {
    if (!domain || !facultyCode) return "";
    const uni = UNIVERSITIES[domain];
    if (!uni) return facultyCode;
    const faculty = uni.faculties[facultyCode];
    if (!faculty) return facultyCode;
    return intl.formatMessage({
      id: faculty.nameKey,
      defaultMessage: faculty.name,
    });
  };

  const translateMajor = (majorKey: string | null | undefined): string => {
    if (!majorKey) return "";
    return intl.formatMessage({ id: majorKey, defaultMessage: majorKey });
  };

  // Look up majorKey from major name when majorKey is not available
  const findMajorKey = (
    domain: string | null | undefined,
    facultyCode: string | null | undefined,
    majorName: string | null | undefined,
  ): string | null => {
    if (!domain || !facultyCode || !majorName) return null;
    const uni = UNIVERSITIES[domain];
    if (!uni) return null;
    const faculty = uni.faculties[facultyCode];
    if (!faculty) return null;
    const majorIndex = faculty.majors.indexOf(majorName);
    if (majorIndex >= 0 && faculty.majorKeys[majorIndex]) {
      return faculty.majorKeys[majorIndex];
    }
    return null;
  };

  const translateConversationName = (conversation: {
    type?: ConversationTypeForTranslation;
    name?: string;
    universityDomain?: string;
    facultyCode?: string;
    major?: string;
    majorKey?: string;
    yearOfStudy?: number;
  }): string => {
    if (!conversation.type) return conversation.name || "";

    // ConversationType: Direct=0, Group=1, University=2, Faculty=3, Major=4, MajorYear=5
    switch (conversation.type) {
      case 2: // University
        return (
          translateUniversity(conversation.universityDomain) ||
          conversation.name ||
          ""
        );
      case 3: // Faculty
        return (
          translateFaculty(
            conversation.universityDomain,
            conversation.facultyCode,
          ) ||
          conversation.name ||
          ""
        );
      case 4: {
        // Major
        const resolvedMajorKey =
          conversation.majorKey ||
          findMajorKey(
            conversation.universityDomain,
            conversation.facultyCode,
            conversation.major,
          );
        return (
          translateMajor(resolvedMajorKey) ||
          conversation.major ||
          conversation.name ||
          ""
        );
      }
      case 5: {
        // MajorYear
        const resolvedMajorKeyYear =
          conversation.majorKey ||
          findMajorKey(
            conversation.universityDomain,
            conversation.facultyCode,
            conversation.major,
          );
        const majorName =
          translateMajor(resolvedMajorKeyYear) || conversation.major || "";
        const yearLabel = intl.formatMessage({
          id: "chat.year",
          defaultMessage: "Year",
        });
        return majorName
          ? `${majorName} – ${yearLabel} ${conversation.yearOfStudy}`
          : conversation.name || "";
      }
      default:
        return conversation.name || "";
    }
  };

  return {
    translateUniversity,
    translateFaculty,
    translateMajor,
    translateConversationName,
  };
}
