"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { IntlProvider } from "react-intl";
import enMessages from "@app/locales/en.json";
import ukMessages from "@app/locales/uk.json";

const LocaleContext = React.createContext<{
  locale: "en" | "uk";
  switchLocale: (l: "en" | "uk") => void;
} | null>(null);

export const ClientIntlProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState<"en" | "uk">("en");
  const [messages, setMessages] = useState(enMessages);

  useEffect(() => {
    const stored = (localStorage.getItem("locale") as "en" | "uk") || "en";
    setLocale(stored);
    setMessages(stored === "uk" ? ukMessages : enMessages);
  }, []);

  const switchLocale = (next: "en" | "uk") => {
    localStorage.setItem("locale", next);
    setLocale(next);
    setMessages(next === "uk" ? ukMessages : enMessages);
  };

  return (
    <LocaleContext.Provider value={{ locale, switchLocale }}>
      <IntlProvider locale={locale} defaultLocale="en" messages={messages}>
        {children}
      </IntlProvider>
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const ctx = React.useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be inside ClientIntlProvider");
  return ctx;
};
