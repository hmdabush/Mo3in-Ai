import { NextRequest, NextResponse } from 'next/server';

/**
 * Gemini Imagen API endpoint for image generation
 * Used by: CreatorStudio, Photoshoot, Campaign, Storyboard
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, numberOfImages = 1, aspectRatio = '1:1' } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    // Use Gemini Imagen 3 for image generation
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instances: [{ prompt }],
          parameters: {
            sampleCount: Math.min(numberOfImages, 4), // Max 4 per request
            aspectRatio: aspectRatio, // "1:1", "16:9", "9:16", "3:4", "4:3"
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini Imagen error:', errorData);

      // Fallback: try with Gemini 2.0 Flash for image generation
      return await fallbackGeminiFlash(apiKey, prompt, numberOfImages);
    }

    const data = await response.json();

    // Imagen returns base64 images
    const images: string[] = (data.predictions || []).map(
      (pred: { bytesBase64Encoded: string; mimeType?: string }) => {
        const mimeType = pred.mimeType || 'image/png';
        return `data:${mimeType};base64,${pred.bytesBase64Encoded}`;
      }
    );

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate images' },
      { status: 500 }
    );
  }
}

/**
 * Fallback: Use Gemini 2.0 Flash with image generation capability
 */
async function fallbackGeminiFlash(apiKey: string, prompt: string, numberOfImages: number) {
  try {
    const images: string[] = [];

    for (let i = 0; i < Math.min(numberOfImages, 4); i++) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: `Generate this image: ${prompt}` },
                ],
              },
            ],
            generationConfig: {
              responseModalities: ['TEXT', 'IMAGE'],
            },
          }),
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        console.error('Gemini Flash fallback error:', errText);
        continue;
      }

      const data = await response.json();
      const parts = data.candidates?.[0]?.content?.parts || [];

      for (const part of parts) {
        if (part.inlineData) {
          const mimeType = part.inlineData.mimeType || 'image/png';
          images.push(`data:${mimeType};base64,${part.inlineData.data}`);
        }
      }
    }

    if (images.length === 0) {
      return NextResponse.json({ error: 'No images generated' }, { status: 500 });
    }

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Fallback generation error:', error);
    return NextResponse.json({ error: 'Failed to generate images' }, { status: 500 });
  }
}
