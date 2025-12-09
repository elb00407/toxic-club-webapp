import "./globals.css";

export const metadata = {
  title: "toxicskill",
  description: "Premium club webapp",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
