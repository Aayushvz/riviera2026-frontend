export async function GET() {
  return Response.json({ message: "Ping from Next.js API route" })
}

export const dynamic = "force-dynamic"
