import { NextResponse } from "next/server";

// Демонстрация валидации initData или localId
export async function POST(req: Request) {
  const body = await req.json();

  const { pcId, startsAt, endsAt, initData, localId } = body || {};
  if (!pcId || !startsAt || !endsAt) {
    return NextResponse.json({ ok: false, error: "pcId/startsAt/endsAt обязательны" }, { status: 400 });
  }

  // Если Telegram initData есть — проверяем, что это непустая строка (на проде тут должна быть реальная проверка подписи)
  if (initData && typeof initData === "string" && initData.length > 0) {
    // Допускаем как валидное для дев-мода
  } else if (!localId) {
    // Если нет валидного initData — требуется localId
    return NextResponse.json({ ok: false, error: "initData или localId обязателен" }, { status: 400 });
  }

  // Успешная бронь (мок)
  const bookingId = `bk-${Date.now()}`;
  return NextResponse.json({ ok: true, booking: { id: bookingId, pcId, startsAt, endsAt } });
}
