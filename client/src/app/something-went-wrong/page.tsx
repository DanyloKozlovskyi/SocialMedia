"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material";

export default function SomethingWentWrong() {
  const router = useRouter();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h1>Something went wrong</h1>
      <p>We apologize for the inconvenience. Please try again later.</p>
      <Button
        variant="contained"
        color="primary"
        onClick={() => router.push("/")}
        sx={{ mt: 2 }}
      >
        Go to Home
      </Button>
    </div>
  );
}
