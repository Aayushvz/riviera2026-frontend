// export async function GET(
//   request: Request,
//   { params }: { params: Promise<{ id: string }> },
// ) {
//   const { id } = await params
//   try {
//     const response = await fetch(`${process.env.BASE_URL}/decor/${id}`)

import { title } from "process"

//     if (!response.ok) {
//       const errorData = await response.json()
//       return Response.json(
//         { error: "Failed to fetch decor", details: errorData },
//         { status: response.status },
//       )
//     }

//     const data = await response.json()
//     return Response.json(data)
//   } catch (error) {
//     console.error("Error fetching decor:", error)
//     return Response.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  try {
    // Construct the response object
    const responseData = {
      title: "SDG Awareness Decor",
      contributions_made: "Aman, Varshith, Rupaak",
      decor_info:
        "This decor highlights the 17 UN Sustainable Development Goals (SDGs), promoting awareness about global challenges such as poverty, climate action, clean energy, and quality education through creative visual storytelling.",
      images: [
        "https://i.postimg.cc/tTPHCYMq/IMG-20260106-WA0027-Aniruddh-Agarwal-24BCE2444.jpg",
        "https://i.postimg.cc/tRKz8DPV/Screenshot-20260115-104155-Surendra-Patil-23BEC0194.jpg",
      ],
      materials:
        "Scrap papers, cardboard, old newspapers, glue, scissors, paint",
      time_taken: "1 day",
    }

    // Return the response data
    return Response.json(responseData)
  } catch (error) {
    console.error("Error fetching decor:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const dynamic = "force-dynamic"
