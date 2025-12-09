import "./globals.css";
import AppLoader from "@/components/AppLoader";

export const metadata = { title: "toxicskill", description: "Premium club webapp" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <AppLoader>{children}</AppLoader>
      </body>
    </html>
  );
}
