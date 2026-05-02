"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@shared/ui/inputs/input";
import Button from "@shared/ui/buttons/button";
import { login, saveTokens } from "@entities/auth";
import { setCookie } from "@shared/api";
import { UniversityOnboardingModal } from "@features/university-onboarding";
import { getUniversityDomain } from "@shared/lib/universities";
import classes from "./sign-in.module.scss";

const SignInPage = () => {
  const router = useRouter();

  const [account, setAccount] = useState({
    email: "",
    password: "",
  });

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [loggedInEmail, setLoggedInEmail] = useState("");

  const handleChange = (field: string, value: string) => {
    setAccount((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login(account);
      saveTokens(response);

      // Save email for university detection
      const email = response.email || account.email;
      setCookie("user_email", email);

      // Check if user has a university email
      const uniDomain = getUniversityDomain(email);
      if (uniDomain) {
        setLoggedInEmail(email);
        setShowOnboarding(true);
      } else {
        router.push("/home");
      }
    } catch (err) {
      console.error("Sign-in failed:", err);
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    router.push("/home");
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={classes.container}>
        <h2 className={classes.title}>Sign In</h2>
        <Input
          type="email"
          placeholder="Email"
          value={account.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className={classes.input}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={account.password}
          onChange={(e) => handleChange("password", e.target.value)}
          className={classes.input}
          required
        />
        <Button type="submit" className={classes.button}>
          Sign In
        </Button>

        <div className={classes.links}>
          <a href="/sign-up">Sign up</a>
        </div>
      </form>

      {showOnboarding && (
        <UniversityOnboardingModal
          email={loggedInEmail}
          onComplete={handleOnboardingComplete}
        />
      )}
    </>
  );
};

export default SignInPage;
