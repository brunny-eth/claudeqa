// server/index.js
require('dotenv').config();
const express = require('express');
const { Anthropic } = require('@anthropic-ai/sdk');
const { USGA_RULES } = require('./rules.js');
const app = express();

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const { message, format } = req.body;
    console.log('Received format:', format);
    
    if (!format) {
      console.error('No format provided');
      return res.status(400).json({ error: 'Format not specified' });
    }

    // Define format-specific keywords to check against
    const formatKeywords = {
      'friday-fourball': ['partner', 'better ball', 'four-ball', 'both balls', 'my ball', 'his ball', 'her ball'],
      'saturday-fourball': ['partner', 'better ball', 'four-ball', 'both balls', 'my ball', 'his ball', 'her ball'],
      'saturday-alternate': ['partner', 'alternate shot', 'alternate', 'foursomes', 'alt shot'],
      'sunday-singles': ['opponent', 'singles', 'match play']
    };

    // Check if message contains keywords from wrong formats
    const currentFormatType = format.includes('fourball') ? 'fourball' : 
                            format.includes('alternate') ? 'alternate' : 'singles';
    
    const wrongFormatDetected = Object.entries(formatKeywords)
      .filter(([key]) => !key.includes(currentFormatType))
      .some(([_, keywords]) => 
        keywords.some(keyword => 
          message.toLowerCase().includes(keyword.toLowerCase())
        )
      );

    const systemPrompt = `You are a STRICT rules official for the Phi Ryder Cup 2024. Your primary duty is to enforce format-specific rules.

CURRENT FORMAT: ${format.toUpperCase()}

STRICT FORMAT ENFORCEMENT RULES:
1. Players MUST use the correct format selection for their questions
2. If a player mentions keywords or scenarios from a different format, immediately redirect them
3. Do NOT provide any rules guidance if the wrong format is detected
4. Instead, tell them which format they should select

FORMAT DEFINITIONS:
- SUNDAY SINGLES: Individual match play only. No partners, no team play.
- SATURDAY ALTERNATE SHOT: Two players as one team, sharing one ball, alternating shots.
- FOUR-BALL: Two players as partners, each playing their own ball.

${wrongFormatDetected ? `ALERT: Question appears to be about the wrong format. Direct player to switch formats.` : ''}

Reference rules: ${USGA_RULES}

Keep responses under 2 sentences. Be direct and format-specific.`;

    const userPrompt = wrongFormatDetected ? 
      `The player asked: "${message}" while in ${format} format. Tell them they need to switch formats.` :
      message;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
      max_tokens: 1024,
    });

    res.json({ response: response.content[0].text });
  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({ error: 'Failed to get response' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));