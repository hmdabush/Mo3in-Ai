import { NextRequest, NextResponse } from 'next/server';

/**
 * Universal Claude API endpoint for text generation
 * Used by: Marketing, Plan, PromptEngineer, and other text-based tools
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tool, prompt, systemPrompt, maxTokens = 4096 } = body;

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Anthropic API key not configured' }, { status: 500 });
    }

    // Select model based on tool complexity
    const model = tool === 'web-builder'
      ? 'claude-sonnet-4-20250514'  // Opus-level for code generation
      : 'claude-sonnet-4-20250514'; // Sonnet for everything else

    const messages: Array<{ role: string; content: string | Array<{ type: string; text?: string; source?: { type: string; media_type: string; data: string } }> }> = [
      { role: 'user', content: prompt },
    ];

    const requestBody: Record<string, unknown> = {
      model,
      max_tokens: maxTokens,
      messages,
    };

    // Add system prompt if provided
    if (systemPrompt) {
      requestBody.system = systemPrompt;
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Claude API error:', errorData);
      return NextResponse.json(
        { error: `Claude API error: ${response.status}`, details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '';

    return NextResponse.json({
      text,
      usage: data.usage,
      model: data.model,
    });
  } catch (error) {
    console.error('Content generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}
