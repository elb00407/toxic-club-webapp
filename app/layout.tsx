import "./globals.css";
import LoaderWrapper from "@/components/LoaderWrapper";

export const metadata = {
  title: "toxicskill",
  description: "Premium club webapp",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <LoaderWrapper>{children}</LoaderWrapper>
      </body>
    </html>
  );
}
