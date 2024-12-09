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
    console.log('Received format:', format); // Debug log
    
    if (!format) {
      console.error('No format provided');
      return res.status(400).json({ error: 'Format not specified' });
    }

    let formatContext = '';
    let formatRules = '';
    
    switch (format) {
      case 'friday-fourball':
      case 'saturday-fourball':
        formatContext = 'You are currently playing Four-Ball format (also known as better ball).';
        formatRules = `
          Key Four-Ball Rules:
          - Each player plays their own ball
          - The better score of the partners counts as the team score
          - Partners may give each other advice
          - If a question doesn't relate to Four-Ball format, inform them they need to select the correct format
        `;
        break;
      case 'saturday-alternate':
        formatContext = 'You are currently playing Alternate Shot format (also known as Foursomes).';
        formatRules = `
          Key Alternate Shot Rules:
          - Partners play one ball, alternating shots
          - Players alternate tee shots (one takes odd holes, other takes even holes)
          - If someone asks about individual balls or better ball scoring, inform them they've selected the wrong format
          - A breach of rules by either partner affects the team
        `;
        break;
      case 'sunday-singles':
        formatContext = 'You are currently playing Singles Match Play format.';
        formatRules = `
          Key Singles Rules:
          - This is one-on-one match play
          - If someone asks about partners or team play, inform them they've selected the wrong format
          - Each hole is won, lost, or halved individually
        `;
        break;
      default:
        console.error('Invalid format:', format);
        return res.status(400).json({ error: 'Invalid format specified' });
    }
    
    console.log('Using format context:', formatContext); // Debug log

    const systemPrompt = `You are a golf rules assistant providing quick, practical guidance for the Phi Ryder Cup 2024. 
    
    CURRENT FORMAT: ${formatContext}
    ${formatRules}

    This is CRITICAL: You must STRICTLY enforce the format rules. If a player asks about a situation that doesn't apply to their current format, you must:
    1. Immediately point out they've selected the wrong format
    2. Tell them which format they should select instead
    3. Do not provide rules guidance for the wrong format

    Use this official rulebook as your reference: ${USGA_RULES}
    
    Keep responses EXTREMELY brief - maximum 2-3 short sentences. Focus only on the immediate action needed.
    `;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      system: systemPrompt,
      messages: [{ role: 'user', content: message }],
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