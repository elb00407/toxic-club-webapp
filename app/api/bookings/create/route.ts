import { NextResponse } from "next/server";

// Дев-режим: принимаем initData как непустую строку, иначе ждём localId
export async function POST(req: Request) {
  const body = await req.json();
  const { pcId, startsAt, endsAt, initData, localId } = body || {};

  if (!pcId || !startsAt || !endsAt) {
    return NextResponse.json({ ok: false, error: "pcId/startsAt/endsAt обязательны" }, { status: 400 });
  }
  if (!(initData && typeof initData === "string" && initData.length > 0) && !localId) {
    return NextResponse.json({ ok: false, error: "initData или localId обязателен" }, { status: 400 });
  }

  const bookingId = `bk-${Date.now()}`;
  return NextResponse.json({ ok: true, booking: { id: bookingId, pcId, startsAt, endsAt } });
}
