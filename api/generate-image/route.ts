export async function POST(req: Request) {
    const { prompt } = await req.json()
  
    const response = await fetch("YOUR_IMAGE_API_ENDPOINT", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.IMAGE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    })
  
    const data = await response.json()
  
    return Response.json({
      imageUrl: data.image_url,
    })
  }