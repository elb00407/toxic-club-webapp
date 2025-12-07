import "./globals.css";

export const metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || "Toxic Club",
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#0b0b0c",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <div className="tox-watermark">TOXIC</div>
        {children}
      </body>
    </html>
  );
}
