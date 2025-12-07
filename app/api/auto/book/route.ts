import { NextRequest } from "next/server";
import { pcs } from "@/lib/mock";
import { verifyInitData, parseTelegramUser } from "@/lib/telegram";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { isVip, startsAt, endsAt, initData } = body || {};

  // Проверка входных данных
  if (typeof isVip !== "boolean" || !startsAt || !endsAt || !initData) {
    return new Response(
      JSON.stringify({ ok: false, error: "isVip/startsAt/endsAt/initData обязателен" }),
      { status: 400 }
    );
  }

  // Проверка подписи Telegram
  const valid = verifyInitData(initData, process.env.BOT_TOKEN!);
  if (!valid) {
    return new Response(JSON.stringify({ ok: false, error: "Неверная подпись Telegram" }), { status: 401 });
  }

  // Получаем пользователя из initData
  const user = parseTelegramUser(initData);
  if (!user) {
    return new Response(JSON.stringify({ ok: false, error: "Нет данных пользователя" }), { status: 401 });
  }

  // Находим кандидатов по категории
  const candidates = pcs.filter(p => p.isVip === isVip && p.status === "active");
  if (candidates.length === 0) {
    return new Response(JSON.stringify({ ok: false, error: "Нет доступных ПК" }), { status: 404 });
  }

  // Пока просто берём первый свободный ПК (mock)
  const pc = candidates[0];

  const booking = {
    id: `mock-${Date.now()}`,
    pcId: pc.id,
    pcLabel: pc.label,
    startsAt,
    endsAt,
    status: "confirmed",
    user: { id: user.id, username: user.username, name: user.first_name },
  };

  return Response.json({ ok: true, booking });
}
