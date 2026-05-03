"use client";

import { useState, useEffect, useCallback } from "react";
import CloseIcon from "@mui/icons-material/Close";
import {
  getUniversityDomain,
  getAllFaculties,
  getUniversityLogoBasePath,
  getFacultyLogoBasePath,
  UNIVERSITIES,
} from "@shared/lib/universities";
import type { FacultyRegistry } from "@shared/lib/universities";
import {
  useUniversityStore,
  updateUniversityInfo,
  updateInterests,
} from "@entities/university";
import { fetchImageWithFallbacks } from "@entities/image";
import classes from "./university-onboarding.module.scss";

interface Props {
  email: string;
  onComplete: () => void;
  forceShow?: boolean;
}

type Step = "confirm" | "faculty" | "details" | "success";

const UniversityOnboardingModal = ({ email, onComplete, forceShow }: Props) => {
  const {
    setUniversityInfo,
    setOnboardingDismissed,
    onboardingDismissed,
    universityDomain: storedDomain,
  } = useUniversityStore();

  const uniDomain = getUniversityDomain(email);
  const university = uniDomain ? UNIVERSITIES[uniDomain] : null;

  const [step, setStep] = useState<Step>("confirm");
  const [uniLogoUrl, setUniLogoUrl] = useState<string | null>(null);
  const [facultyLogos, setFacultyLogos] = useState<Record<string, string>>({});
  const [selectedFacultyCode, setSelectedFacultyCode] = useState<string | null>(
    null,
  );
  const [selectedMajor, setSelectedMajor] = useState<string>("");
  const [yearOfStudy, setYearOfStudy] = useState<number>(1);
  const [academicRole, setAcademicRole] = useState<string>("student");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [interests, setInterests] = useState<string[]>([]);
  const [customTagInput, setCustomTagInput] = useState<string>("");

  // Don't show if: no university match, already onboarded, or already dismissed
  const shouldShow =
    forceShow || (!!university && !onboardingDismissed && !storedDomain);

  // Load university logo
  useEffect(() => {
    if (!university || !uniDomain) return;
    const logoBaseUrl = getUniversityLogoBasePath(uniDomain);
    if (!logoBaseUrl) {
      setUniLogoUrl(null);
      return;
    }
    fetchImageWithFallbacks(logoBaseUrl, ["png", "svg", "jpg", "jpeg"])
      .then(setUniLogoUrl)
      .catch(() => setUniLogoUrl(null));
  }, [university, uniDomain]);

  // Load faculty logos when entering faculty step
  useEffect(() => {
    if (step !== "faculty" || !uniDomain) return;

    const faculties = getAllFaculties(uniDomain);
    faculties.forEach(({ code }) => {
      const fLogoBaseUrl = getFacultyLogoBasePath(uniDomain, code);
      if (fLogoBaseUrl) {
        fetchImageWithFallbacks(fLogoBaseUrl, ["png", "svg", "jpg", "jpeg"])
          .then((url) => setFacultyLogos((prev) => ({ ...prev, [code]: url })))
          .catch(() => {});
      }
    });
  }, [step, uniDomain]);

  const handleDismiss = useCallback(() => {
    setOnboardingDismissed(true);
    onComplete();
  }, [setOnboardingDismissed, onComplete]);

  const handleConfirmYes = () => setStep("faculty");

  const handleSelectFaculty = (code: string) => {
    setSelectedFacultyCode(code);
    setSelectedMajor("");
    // Auto-populate interests from faculty
    if (uniDomain) {
      const faculty = UNIVERSITIES[uniDomain]?.faculties[code];
      if (faculty?.interests) {
        setInterests([...faculty.interests]);
      }
    }
    setStep("details");
  };

  const handleRemoveInterest = (tag: string) => {
    setInterests((prev) => prev.filter((t) => t !== tag));
  };

  const handleAddCustomTag = () => {
    const tag = customTagInput.trim().toLowerCase();
    if (tag && !interests.includes(tag)) {
      setInterests((prev) => [...prev, tag]);
    }
    setCustomTagInput("");
  };

  const handleCustomTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCustomTag();
    }
  };

  const selectedFaculty: FacultyRegistry | null =
    uniDomain && selectedFacultyCode
      ? (UNIVERSITIES[uniDomain]?.faculties[selectedFacultyCode] ?? null)
      : null;

  const handleSubmit = async () => {
    if (!uniDomain || !university || !selectedFacultyCode || !selectedFaculty)
      return;
    setIsSubmitting(true);

    try {
      await updateUniversityInfo({
        universityDomain: uniDomain,
        universityName: university.name,
        facultyCode: selectedFacultyCode,
        facultyName: selectedFaculty.name,
        major: selectedMajor || null,
        yearOfStudy,
        academicRole,
      });

      // Save interests
      await updateInterests(interests);

      setUniversityInfo({
        universityDomain: uniDomain,
        universityName: university.name,
        facultyCode: selectedFacultyCode,
        facultyName: selectedFaculty.name,
      });

      setOnboardingDismissed(true);
      setStep("success");
    } catch (err) {
      console.error("Failed to save university info:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!shouldShow) return null;

  const faculties = uniDomain ? getAllFaculties(uniDomain) : [];

  return (
    <div className={classes.overlay} onClick={handleDismiss}>
      <div className={classes.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={classes.header}>
          <span className={classes.stepLabel}>
            {step === "confirm" && "Step 1 of 3"}
            {step === "faculty" && "Step 2 of 3"}
            {step === "details" && "Step 3 of 3"}
            {step === "success" && "Done!"}
          </span>
          <button
            className={classes.closeBtn}
            onClick={handleDismiss}
            type="button"
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>

        {/* ── Step 1: Confirm university ── */}
        {step === "confirm" && university && (
          <>
            <div className={classes.logoSection}>
              {uniLogoUrl ? (
                <img
                  src={uniLogoUrl}
                  alt={university.name}
                  className={classes.uniLogo}
                />
              ) : (
                <div className={classes.uniLogo} />
              )}
              <div className={classes.uniName}>{university.name}</div>
            </div>
            <div className={classes.question}>
              Are you associated with this university?
            </div>
            <div className={classes.actions}>
              <button
                className={classes.primaryBtn}
                onClick={handleConfirmYes}
                type="button"
              >
                Yes, I am
              </button>
              <button
                className={classes.secondaryBtn}
                onClick={handleDismiss}
                type="button"
              >
                Not now
              </button>
            </div>
          </>
        )}

        {/* ── Step 2: Pick faculty ── */}
        {step === "faculty" && (
          <>
            <div className={classes.logoSection}>
              <div className={classes.uniName}>Choose your faculty</div>
            </div>
            <div className={classes.facultyList}>
              {faculties.map(({ code, faculty }) => (
                <div
                  key={code}
                  className={
                    selectedFacultyCode === code
                      ? classes.facultyItemSelected
                      : classes.facultyItem
                  }
                  onClick={() => handleSelectFaculty(code)}
                >
                  {facultyLogos[code] ? (
                    <img
                      src={facultyLogos[code]}
                      alt={faculty.name}
                      className={classes.facultyLogo}
                    />
                  ) : (
                    <div className={classes.facultyLogo} />
                  )}
                  <div className={classes.facultyInfo}>
                    <div className={classes.facultyName}>{faculty.name}</div>
                    <div className={classes.facultyCode}>{code}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Step 3: Details ── */}
        {step === "details" && selectedFaculty && (
          <>
            <div className={classes.logoSection}>
              {selectedFacultyCode && facultyLogos[selectedFacultyCode] ? (
                <img
                  src={facultyLogos[selectedFacultyCode]}
                  alt={selectedFaculty.name}
                  className={classes.uniLogo}
                />
              ) : (
                <div className={classes.uniLogo} />
              )}
              <div className={classes.uniName}>{selectedFaculty.name}</div>
            </div>

            <div className={classes.formGroup}>
              <label className={classes.formLabel}>Major</label>
              <select
                className={classes.formSelect}
                value={selectedMajor}
                onChange={(e) => setSelectedMajor(e.target.value)}
              >
                <option value="">Select major…</option>
                {selectedFaculty.majors.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div className={classes.formGroup}>
              <label className={classes.formLabel}>Year of study</label>
              <select
                className={classes.formSelect}
                value={yearOfStudy}
                onChange={(e) => setYearOfStudy(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5, 6].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div className={classes.formGroup}>
              <label className={classes.formLabel}>Role</label>
              <select
                className={classes.formSelect}
                value={academicRole}
                onChange={(e) => setAcademicRole(e.target.value)}
              >
                <option value="student">Student</option>
                <option value="lecturer">Lecturer</option>
                <option value="ta">Teaching Assistant</option>
                <option value="alumni">Alumni</option>
              </select>
            </div>

            <div className={classes.formGroup}>
              <label className={classes.formLabel}>Interests</label>
              <div className={classes.interestChips}>
                {interests.map((tag) => (
                  <span key={tag} className={classes.interestChip}>
                    {tag}
                    <button
                      type="button"
                      className={classes.chipRemove}
                      onClick={() => handleRemoveInterest(tag)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className={classes.addTagRow}>
                <input
                  type="text"
                  className={classes.formInput}
                  placeholder="Add custom tag..."
                  value={customTagInput}
                  onChange={(e) => setCustomTagInput(e.target.value)}
                  onKeyDown={handleCustomTagKeyDown}
                />
                <button
                  type="button"
                  className={classes.addTagBtn}
                  onClick={handleAddCustomTag}
                  disabled={!customTagInput.trim()}
                >
                  Add
                </button>
              </div>
            </div>

            <div className={classes.actions}>
              <button
                className={classes.secondaryBtn}
                onClick={() => setStep("faculty")}
                type="button"
              >
                Back
              </button>
              <button
                className={classes.primaryBtn}
                onClick={handleSubmit}
                disabled={isSubmitting}
                type="button"
              >
                {isSubmitting ? "Saving…" : "Confirm"}
              </button>
            </div>
          </>
        )}

        {/* ── Success ── */}
        {step === "success" && (
          <div className={classes.successSection}>
            <div className={classes.successIcon}>🎓</div>
            <div className={classes.successTitle}>You&apos;re all set!</div>
            <div className={classes.successSubtitle}>
              You can now switch to University Mode to see posts from your
              classmates and join faculty chats.
            </div>
            <div className={classes.actions} style={{ marginTop: 20 }}>
              <button
                className={classes.primaryBtn}
                onClick={onComplete}
                type="button"
              >
                Get started
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { UniversityOnboardingModal };
