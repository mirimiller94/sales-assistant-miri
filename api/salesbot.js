// api/salesbot.js

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text } = req.body || {};

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Missing text field in body' });
    }

    // לוג בסיסי – מה הלקוח אמר
    console.log('📝 NEW ENTRY:', {
      time: new Date().toISOString(),
      customerText: text.slice(0, 200)
    });

    const prompt = `
הלקוח אמר: "${text}"

נסח תגובת נציג מקצועית וקצרה מאוד (עד שני משפטים),
בסגנון מכירה של ניר דובדבני:
ברור, חד, לא לוחץ,
מבליט את היתרון הפיננסי לטווח ארוך למרות אי הנוחות הרגעית.
כתוב בעברית תקינה ובטון בטוח ורגוע.
    `;

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 80,
        temperature: 0.8
      })
    });

    if (!openaiRes.ok) {
      const errText = await openaiRes.text();
      console.error('OpenAI error:', openaiRes.status, errText);
      return res.status(500).json({ error: 'OpenAI request failed', detail: errText });
    }

    const data = await openaiRes.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || '';

    // לוג גם של התגובה
    console.log('✅ BOT REPLY:', {
      time: new Date().toISOString(),
      reply: reply.slice(0, 200)
    });

    res.status(200).json({ reply });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
