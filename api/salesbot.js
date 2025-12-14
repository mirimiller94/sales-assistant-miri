import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
    }

  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Missing text" });
  }

  try {
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      instructions:
        "אתה עוזר מכירות פיננסי. תן עד שני משפטים קצרים, חדים, ערכיים ובלי לחץ.",
      input: `הלקוח אמר: "${text}".`,
    });

    const reply = response.output_text;
    return res.status(200).json({ reply });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({ error: "OpenAI request failed" });
  }
}
