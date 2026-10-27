import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '50mb' }));

const geminiApiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: geminiApiKey });

// API: Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasKey: !!geminiApiKey,
    timestamp: new Date().toISOString(),
  });
});

// API: Real Video Generation using gemini-omni-1.1-flash (Interactions API)
app.post('/api/generate-video', async (req: Request, res: Response): Promise<any> => {
  try {
    const { prompt, aspectRatio, duration, resolution } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'يرجى إدخال وصف للفيديو الإعلاني (prompt).' });
    }

    if (!geminiApiKey) {
      return res.status(500).json({
        error: 'مفتاح GEMINI_API_KEY غير متاح على السيرفر. يرجى ضبط المفتاح في إعدادات البيئة.',
      });
    }

    const selectedRatio = aspectRatio === '16:9' ? '16:9' : '9:16';
    const selectedDuration = duration === '10s' ? '10s' : '5s';
    const selectedResolution = resolution === '1080p' ? '1080p' : '720p';

    console.log(`[VideoGen] Generating video with gemini-omni-1.1-flash... Ratio: ${selectedRatio}`);

    const interaction = await ai.interactions.create(
      {
        model: 'gemini-omni-1.1-flash',
        input: prompt,
        background: false,
        store: false,
        stream: false,
        response_format: {
          type: 'video',
          aspect_ratio: selectedRatio,
          duration: selectedDuration,
          resolution: selectedResolution,
        },
      },
      { timeout: 300000 } // 5 minutes timeout for video rendering
    );

    const videoPart = interaction.output_video;

    if (videoPart && videoPart.data) {
      const mimeType = videoPart.mime_type || 'video/mp4';
      const videoDataUrl = `data:${mimeType};base64,${videoPart.data}`;

      return res.json({
        success: true,
        videoUrl: videoDataUrl,
        mimeType,
        aspectRatio: selectedRatio,
        duration: selectedDuration,
      });
    }

    if (videoPart && videoPart.uri) {
      return res.json({
        success: true,
        videoUrl: videoPart.uri,
        aspectRatio: selectedRatio,
        duration: selectedDuration,
      });
    }

    // Check steps array if not directly in output_video helper
    for (const step of interaction.steps) {
      if (step.type === 'model_output' && step.content) {
        const found = step.content.find((c) => c.type === 'video');
        if (found && (found as any).data) {
          const mimeType = (found as any).mime_type || 'video/mp4';
          return res.json({
            success: true,
            videoUrl: `data:${mimeType};base64,${(found as any).data}`,
            aspectRatio: selectedRatio,
          });
        }
      }
    }

    return res.status(500).json({
      error: 'لم يتم استلام محتوى الفيديو من نموذج الذكاء الاصطناعي.',
    });
  } catch (error: any) {
    console.error('[VideoGen Error]:', error);
    return res.status(500).json({
      error: error.message || 'حدث خطأ أثناء توليد الفيديو. تأكد من صلاحيات مفتاح API.',
    });
  }
});

// API: Multi-Turn Gemini Chatbot (Creative Director & Ad Strategist)
app.post('/api/chat', async (req: Request, res: Response): Promise<any> => {
  try {
    const { messages, systemInstruction, model } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'قائمة الرسائل مطلوبة.' });
    }

    if (!geminiApiKey) {
      return res.status(500).json({ error: 'مفتاح GEMINI_API_KEY غير متاح.' });
    }

    const selectedModel = model || 'gemini-3.8-flash';

    // Format contents for generateContent
    const formattedContents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const defaultSystemInstruction =
      systemInstruction ||
      'أنت المستشار الإبداعي ومدير الإعلانات الذكي لمنصة Creovo. هدفك مساعدة أصحاب المتاجر وصناع المحتوى في ابتكار أفكار إعلانات UGC فيروسية، وكتابة Hooks قوية لأول 3 ثوانٍ في TikTok وReels، وتحديد مواصفات البريف المثالية، وصياغة أفضل Prompts لتوليد الفيديوهات بالذكاء الاصطناعي. تحدث باللغة العربية باحترافية وطاقة حماسية داعمة.';

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: formattedContents,
      config: {
        systemInstruction: defaultSystemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'عذراً، لم أتمكن من صياغة إجابة في الوقت الحالي.';

    return res.json({ reply });
  } catch (error: any) {
    console.error('[Chat Error]:', error);
    return res.status(500).json({
      error: error.message || 'حدث خطأ في محادثة الذكاء الاصطناعي.',
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Creovo Server] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Creovo Server Fatal]:', err);
});
