"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@shared/ui/inputs/input";
import Button from "@shared/ui/buttons/button";
import { login, saveTokens } from "@entities/auth";
import classes from "./sign-in.module.scss";

const SignInPage = () => {
  const router = useRouter();

  const [account, setAccount] = useState({
    email: "",
    password: "",
  });

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
      router.push("/home");
    } catch (err) {
      console.error("Sign-in failed:", err);
    }
  };

  return (
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
  );
};

export default SignInPage;
