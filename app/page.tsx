export default function HomePage() {
  return (
    <main className="px-6 py-8">
      <h1 className="text-2xl font-bold mb-4" style={{ color: "#d4ff00" }}>
        Toxic Club
      </h1>
      <p className="mt-3 text-sm" style={{ color: "#9aa0a6" }}>
        Это веб‑приложение для бронирования ПК через Telegram WebApp.
        Открой его прямо из меню бота, чтобы авторизация прошла автоматически.
      </p>
      <div className="mt-6">
        <a href="/webapp" className="tox-button">
          Открыть WebApp
        </a>
      </div>
    </main>
  );
}
