export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const { message } = req.body;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `ನೀನು ಒಬ್ಬ ಸ್ನೇಹಪರ ಕನ್ನಡ AI ಸಹಾಯಕ (Harry). ಬಳಕೆದಾರರ ಮಾತಿಗೆ ಕೇವಲ ಕನ್ನಡದಲ್ಲೇ ಸಂಕ್ಷಿಪ್ತವಾಗಿ ಮತ್ತು ಸ್ಪಷ್ಟವಾಗಿ ಉತ್ತರಿಸು. ಬಳಕೆದಾರರ ಮಾತು: ${message}` }] }]
      })
    });

    const data = await response.json();
    
    let reply = "ಕ್ಷಮಿಸಿ, ನನಗೆ ಅರ್ಥವಾಗಲಿಲ್ಲ.";
    if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
      reply = data.candidates[0].content.parts[0].text;
    } else if (data.error) {
      reply = "API ದೋಷ: " + data.error.message;
    }

    return res.status(200).json({ reply });
  } catch (err) {
    console.error('API Error:', err);
    return res.status(500).json({ error: 'Failed to fetch from Gemini API' });
  }
}

