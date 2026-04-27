"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@shared/ui/buttons/button";
import Input from "@shared/ui/inputs/input";
import { register } from "@entities/auth";
import classes from "./sign-up.module.scss";

const SignUpPage = () => {
  const router = useRouter();

  const [account, setAccount] = useState({
    userName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (field: string, value: string) => {
    setAccount({ ...account, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      await register(account);
      router.push("/home");
    } catch (err) {
      console.error("Registration failed", err);
    }
  };

  return (
    <div className={classes.container}>
      <h2 className={classes.title}>Sign Up</h2>
      <Input
        type="text"
        className={classes.input}
        placeholder="User Name"
        name="userName"
        value={account.userName}
        onChange={(e) => handleChange(e.target.name, e.target.value)}
      />
      <Input
        type="email"
        placeholder="Email"
        className={classes.input}
        name="email"
        value={account.email}
        onChange={(e) => handleChange(e.target.name, e.target.value)}
      />
      <Input
        type="tel"
        placeholder="Phone Number"
        className={classes.input}
        name="phoneNumber"
        value={account.phoneNumber}
        onChange={(e) => handleChange(e.target.name, e.target.value)}
      />
      <Input
        placeholder="Password"
        className={classes.input}
        type="password"
        name="password"
        value={account.password}
        onChange={(e) => handleChange(e.target.name, e.target.value)}
      />
      <Input
        placeholder="Confirm Password"
        className={classes.input}
        type="password"
        name="confirmPassword"
        value={account.confirmPassword}
        onChange={(e) => handleChange(e.target.name, e.target.value)}
      />

      <Button className={classes.button} onClick={handleSubmit}>
        Sign Up
      </Button>
      <div className={classes.links}>
        <a href="/sign-in">Sign in</a>
      </div>
    </div>
  );
};

export default SignUpPage;
