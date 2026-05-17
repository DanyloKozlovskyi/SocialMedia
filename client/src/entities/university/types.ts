export interface UniversityInfo {
  universityDomain: string | null;
  universityName: string | null;
  facultyCode: string | null;
  facultyName: string | null;
  major: string | null;
  majorKey: string | null;
  yearOfStudy: number | null;
  academicRole: string | null;
  isUniversityVerified: boolean;
}

export interface UniversityPeer {
  id: string;
  name: string;
  logoKey: string | null;
  universityDomain: string | null;
  universityName: string | null;
  facultyCode: string | null;
  facultyName: string | null;
  major: string | null;
  majorKey: string | null;
  yearOfStudy: number | null;
  academicRole: string | null;
}

export interface UniversityStats {
  universityCount: number;
  facultyCount: number;
  universityDomain: string | null;
  universityName: string | null;
  facultyCode: string | null;
  facultyName: string | null;
}

export interface UpdateUniversityInfoPayload {
  universityDomain?: string | null;
  universityName?: string | null;
  facultyCode?: string | null;
  facultyName?: string | null;
  major?: string | null;
  majorKey?: string | null;
  yearOfStudy?: number | null;
  academicRole?: string | null;
}
