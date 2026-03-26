import { NextRequest, NextResponse } from 'next/server';

/**
 * Text-to-Speech API using Google Cloud TTS
 * Fallback: Returns a flag for client-side browser TTS
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, voice = 'ar-XA-Standard-A', language = 'ar-XA', speed = 1.0, pitch = 0.0 } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured', useBrowserTTS: true }, { status: 200 });
    }

    // Try Google Cloud TTS API
    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { text },
          voice: {
            languageCode: language,
            name: voice,
          },
          audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: speed,
            pitch: pitch,
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error('Google TTS error:', errText);
      // Return flag for client-side fallback
      return NextResponse.json({ useBrowserTTS: true, text });
    }

    const data = await response.json();
    const audioBase64 = data.audioContent;
    const audioUrl = `data:audio/mp3;base64,${audioBase64}`;

    return NextResponse.json({ audioUrl, duration: Math.ceil(text.length / 15) });
  } catch (error) {
    console.error('TTS error:', error);
    return NextResponse.json({ useBrowserTTS: true });
  }
}
