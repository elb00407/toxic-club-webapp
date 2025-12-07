import { NextRequest } from "next/server";
import { verifyInitData, parseTelegramUser } from "@/lib/telegram";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { pcId, startsAt, endsAt, initData } = body || {};

  if (!pcId || !startsAt || !endsAt || !initData) {
    return new Response(JSON.stringify({ ok: false, error: "pcId/startsAt/endsAt/initData обязателен" }), { status: 400 });
  }

  const valid = verifyInitData(initData, process.env.BOT_TOKEN!);
  if (!valid) {
    return new Response(JSON.stringify({ ok: false, error: "Неверная подпись Telegram" }), { status: 401 });
  }

  const user = parseTelegramUser(initData);
  if (!user) {
    return new Response(JSON.stringify({ ok: false, error: "Нет данных пользователя" }), { status: 401 });
  }

  // Mock бронь
  const booking = {
    id: `mock-${Date.now()}`,
    pcId,
    startsAt,
    endsAt,
    status: "confirmed",
    user: { id: user.id, username: user.username, name: user.first_name },
  };

  return Response.json({ ok: true, booking });
}
