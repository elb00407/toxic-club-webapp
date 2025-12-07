import { pcs } from "@/lib/mock";

export async function GET() {
  return Response.json({ ok: true, pcs });
}
