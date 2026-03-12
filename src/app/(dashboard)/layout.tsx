"use client";
import DashboardShell from "./dashboard/dashboarb-shell";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("sb_token");
    if (!token) router.push("/login");
  }, []);

  return <DashboardShell>{children}</DashboardShell>;
}
