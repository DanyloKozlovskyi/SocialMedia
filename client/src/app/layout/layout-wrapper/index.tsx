"use client";
import { usePathname } from "next/navigation";
import { ClientIntlProvider } from "@app/providers";
import {AuthLayout, MainLayout} from "@app/layout/index";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/sign-in" || pathname === "/sign-up";

  return (
    <ClientIntlProvider>
      {isAuthPage ? (
        <AuthLayout signIn={pathname === "/sign-in"}>{children}</AuthLayout>
      ) : (
        <MainLayout>{children}</MainLayout>
      )}
    </ClientIntlProvider>
  );
}
