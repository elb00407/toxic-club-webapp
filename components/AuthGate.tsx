"use client";
import { useEffect, useState } from "react";
import RegistrationModal from "./RegistrationModal";
import { ensureAdminFlag, getUser } from "@/lib/auth";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [needReg, setNeedReg] = useState(false);

  useEffect(() => {
    const user = getUser();
    setNeedReg(!user);
    ensureAdminFlag(); // автоматически проставит админ-доступ, если мы в Telegram и это ты
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <>
      {needReg && <RegistrationModal onClose={() => setNeedReg(false)} />}
      {!needReg && children}
    </>
  );
}
