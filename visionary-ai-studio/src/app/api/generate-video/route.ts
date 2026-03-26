import { NextRequest, NextResponse } from 'next/server';

/**
 * KIE.AI Veo 3.1 Video Generation API
 * Used by: VideoStudio
 *
 * Flow:
 * 1. POST /api/generate-video (this endpoint) → starts generation, returns taskId
 * 2. GET /api/generate-video?taskId=xxx → polls for status & video URL
 */

// POST: Start video generation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      prompt,
      imageUrls = [],
      model = 'veo3_fast',
      aspectRatio = '16:9',
      generationType = 'TEXT_2_VIDEO',
    } = body;

    const apiKey = process.env.KIE_API_KEY;
    if (!apiKey || apiKey === 'your_kie_api_key_here') {
      return NextResponse.json(
        { error: 'KIE API key not configured. Get your key from https://kie.ai' },
        { status: 500 }
      );
    }

    const requestBody: Record<string, unknown> = {
      prompt,
      model,
      aspect_ratio: aspectRatio,
      generationType,
      enableTranslation: true,
    };

    // Add images for image-to-video mode
    if (imageUrls.length > 0) {
      requestBody.imageUrls = imageUrls;
      if (!body.generationType) {
        requestBody.generationType = imageUrls.length <= 2
          ? 'FIRST_AND_LAST_FRAMES_2_VIDEO'
          : 'REFERENCE_2_VIDEO';
      }
    }

    const response = await fetch('https://api.kie.ai/api/v1/veo/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('KIE API error:', errorData);
      return NextResponse.json(
        { error: `KIE API error: ${response.status}`, details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (data.code !== 200) {
      return NextResponse.json(
        { error: data.msg || 'Video generation failed' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      taskId: data.data?.taskId,
      status: 'processing',
      message: 'Video generation started',
    });
  } catch (error) {
    console.error('Video generation error:', error);
    return NextResponse.json(
      { error: 'Failed to start video generation' },
      { status: 500 }
    );
  }
}

// GET: Check video generation status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');

    if (!taskId) {
      return NextResponse.json({ error: 'taskId is required' }, { status: 400 });
    }

    const apiKey = process.env.KIE_API_KEY;
    if (!apiKey || apiKey === 'your_kie_api_key_here') {
      return NextResponse.json({ error: 'KIE API key not configured' }, { status: 500 });
    }

    // Get video details
    const response = await fetch(
      `https://api.kie.ai/api/v1/veo/details?taskId=${taskId}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('KIE status check error:', errorData);
      return NextResponse.json(
        { error: `Status check failed: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      taskId,
      status: data.data?.status || 'processing',
      videoUrl: data.data?.videoUrl || null,
      progress: data.data?.progress || 0,
    });
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check video status' },
      { status: 500 }
    );
  }
}
