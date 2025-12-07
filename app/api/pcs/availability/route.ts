import { mockAvailability } from "@/lib/mock";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const pcId = req.nextUrl.searchParams.get("pcId");
  const date = req.nextUrl.searchParams.get("date");
  if (!pcId || !date) {
    return new Response(JSON.stringify({ ok: false, error: "pcId/date обязателен" }), { status: 400 });
  }

  const busy = mockAvailability(pcId, date);
  return Response.json({ ok: true, busy });
}
