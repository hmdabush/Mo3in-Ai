import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { siteName, siteType, siteDescription, colorPalette, designStyle, selectedPages, language } = body;

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Anthropic API key not configured' }, { status: 500 });
    }

    // Build the prompt for Claude Opus
    const prompt = buildWebsitePrompt({
      siteName,
      siteType,
      siteDescription,
      colorPalette,
      designStyle,
      selectedPages,
      language: language || 'ar',
    });

    // Call Claude Opus API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 16000,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Anthropic API error:', errorData);
      return NextResponse.json(
        { error: `API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const generatedHtml = extractHtml(data.content[0]?.text || '');

    return NextResponse.json({ html: generatedHtml });
  } catch (error) {
    console.error('Website generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate website' },
      { status: 500 }
    );
  }
}

// Color palette definitions for the prompt
const COLOR_PALETTE_MAP: Record<string, { name: string; colors: string[] }> = {
  'modern-dark': { name: 'Modern Dark', colors: ['#0f0f23', '#1a1a3e', '#6c63ff', '#f8f8ff'] },
  'ocean-breeze': { name: 'Ocean Breeze', colors: ['#0A2647', '#144272', '#205295', '#2C74B3'] },
  'sunset-warm': { name: 'Sunset Warm', colors: ['#2b1055', '#d53369', '#ff6b6b', '#feca57'] },
  'forest-green': { name: 'Forest Green', colors: ['#1a3c40', '#1d5c63', '#417d7a', '#b8e0d2'] },
  'royal-purple': { name: 'Royal Purple', colors: ['#1b0a3c', '#4a1a6b', '#8B5CF6', '#c4b5fd'] },
  'minimal-light': { name: 'Minimal Light', colors: ['#ffffff', '#f5f5f5', '#333333', '#0066ff'] },
  'neon-cyber': { name: 'Neon Cyber', colors: ['#0a0a0a', '#1a1a2e', '#00f5d4', '#f72585'] },
  'earth-tones': { name: 'Earth Tones', colors: ['#2c1810', '#5c3d2e', '#d4a574', '#faf3e3'] },
};

const SITE_TYPE_MAP: Record<string, string> = {
  'landing': 'Landing Page - صفحة هبوط تسويقية',
  'portfolio': 'Portfolio - معرض أعمال شخصي أو وكالة',
  'ecommerce': 'E-Commerce - متجر إلكتروني',
  'blog': 'Blog - مدونة',
  'business': 'Business - موقع شركة أو أعمال',
  'restaurant': 'Restaurant - موقع مطعم',
  'saas': 'SaaS - برنامج خدمي',
  'agency': 'Agency - موقع وكالة',
};

const SECTION_MAP: Record<string, string> = {
  'hero': 'Hero Section (قسم رئيسي بارز مع عنوان وأزرار CTA)',
  'about': 'About Section (عن الشركة/المشروع)',
  'services': 'Services Section (عرض الخدمات بكروت)',
  'testimonials': 'Testimonials Section (آراء وشهادات العملاء)',
  'pricing': 'Pricing Section (جدول الأسعار والباقات)',
  'contact': 'Contact Section (نموذج اتصال ومعلومات التواصل)',
  'faq': 'FAQ Section (الأسئلة الشائعة)',
  'footer': 'Footer (ذيل الصفحة مع روابط وحقوق النشر)',
};

interface PromptParams {
  siteName: string;
  siteType: string;
  siteDescription: string;
  colorPalette: string;
  designStyle: string;
  selectedPages: string[];
  language: string;
}

function buildWebsitePrompt(params: PromptParams): string {
  const palette = COLOR_PALETTE_MAP[params.colorPalette] || COLOR_PALETTE_MAP['modern-dark'];
  const siteType = SITE_TYPE_MAP[params.siteType] || params.siteType;
  const sections = params.selectedPages.map(p => SECTION_MAP[p] || p).join('\n  - ');

  return `أنت مصمم ومطور ويب محترف. مطلوب منك إنشاء موقع إلكتروني كامل بملف HTML واحد.

## معلومات المشروع:
- **اسم الموقع:** ${params.siteName}
- **نوع الموقع:** ${siteType}
- **وصف المشروع:** ${params.siteDescription}
- **لغة المحتوى:** عربي (RTL)

## التصميم:
- **نمط التصميم:** ${params.designStyle}
- **لوحة الألوان:** ${palette.name}
  - الخلفية الرئيسية: ${palette.colors[0]}
  - الخلفية الثانوية: ${palette.colors[1]}
  - اللون المميز (Accent): ${palette.colors[2]}
  - لون النص الرئيسي: ${palette.colors[3]}

## الأقسام المطلوبة:
  - ${sections}

## المتطلبات الفنية:
1. أنشئ ملف HTML واحد كامل يحتوي على كل الـ CSS مدمج (inline styles في <style>)
2. استخدم خط Cairo من Google Fonts
3. تأكد أن التصميم متجاوب (responsive) يعمل على الموبايل والتابلت والديسكتوب
4. أضف تأثيرات حركية (animations) ناعمة وحديثة
5. استخدم الـ RTL direction للغة العربية
6. اجعل التصميم فاخر واحترافي مع:
   - تدرجات لونية (gradients) 
   - تأثيرات زجاجية (glassmorphism) إذا مناسب
   - ظلال (shadows) ناعمة
   - تأثيرات hover تفاعلية
   - أيقونات SVG بسيطة (ارسمها بنفسك)
7. اكتب محتوى واقعي ومناسب للنشاط (ليس نص lorem ipsum)
8. أضف إحصائيات وأرقام مناسبة
9. اجعل الأزرار والروابط تفاعلية (smooth scroll لأقسام الصفحة)

## تنبيه مهم:
- أرسل الكود HTML الكامل فقط، بدون أي شرح أو تعليق قبله أو بعده
- ابدأ مباشرة بـ <!DOCTYPE html> وانتهي بـ </html>
- لا تضع الكود في code block أو backticks`;
}

function extractHtml(text: string): string {
  // Try to extract HTML from code blocks first
  const codeBlockMatch = text.match(/```(?:html)?\s*\n?(<!DOCTYPE[\s\S]*?<\/html>)\s*\n?```/i);
  if (codeBlockMatch) return codeBlockMatch[1].trim();

  // Try direct HTML extraction
  const htmlMatch = text.match(/(<!DOCTYPE[\s\S]*<\/html>)/i);
  if (htmlMatch) return htmlMatch[1].trim();

  // If the whole response looks like HTML
  if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
    return text.trim();
  }

  // Fallback: return as-is
  return text;
}
