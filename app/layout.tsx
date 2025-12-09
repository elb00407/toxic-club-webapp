"use client";
import "./globals.css";
import { useState } from "react";
import Loader from "@/components/Loader";

export const metadata = {
  title: "toxicskill",
  description: "Premium club webapp",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <html lang="ru">
      <body>
        {!loaded && <Loader onFinish={() => setLoaded(true)} />}
        {loaded && children}
      </body>
    </html>
  );
}
