import { NextResponse } from "next/server";

// Мок: занято с 14:00 до 16:30 (UTC)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const pcId = searchParams.get("pcId");
  const date = searchParams.get("date"); // YYYY-MM-DD

  if (!pcId || !date) {
    return NextResponse.json({ busy: [] });
  }

  const busy = [
    { startsAt: `${date}T14:00:00.000Z`, endsAt: `${date}T16:30:00.000Z` },
  ];

  return NextResponse.json({ busy });
}
