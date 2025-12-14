// api/salesbot.js

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { text } = req.body || {};

  if (!text || typeof text !== "string") {
    res.status(400).json({ error: "Missing 'text' in body" });
    return;
  }

  try {
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      instructions:
        "אתה עוזר מכירות פיננסי. תן עד שני משפטים קצרים, חדים, בעברית תקנית, בסגנון ניר דובדבני: לא לוחץ, אלא מדגיש יתרונות לטווח ארוך למרות חוסר הנוחות הזמנית. אין אימוג׳ים, אין רשימות, רק טקסט רציף.",
      input: `הלקוח אומר: "${text}". ניסח תגובת נציג.`,
    });

    const reply = response.output_text;
    res.status(200).json({ reply });
  } catch (err) {
    console.error("OpenAI error:", err);
    res.status(500).json({ error: "OpenAI request failed" });
  }
}
