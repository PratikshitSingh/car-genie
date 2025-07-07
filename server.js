const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Placeholder search functions - API keys should be configured in env vars
async function searchCargurus(query) {
  const apiKey = process.env.CARGURUS_API_KEY;
  if (!apiKey) return [];
  try {
    const response = await axios.get('https://api.cargurus.com/v1/listings', {
      params: { query, api_key: apiKey },
    });
    return response.data.results || [];
  } catch (err) {
    console.error('Cargurus error', err.message);
    return [];
  }
}

async function searchCarfax(query) {
  const apiKey = process.env.CARFAX_API_KEY;
  if (!apiKey) return [];
  try {
    const response = await axios.get('https://api.carfax.com/v1/cars', {
      params: { query, api_key: apiKey },
    });
    return response.data.listings || [];
  } catch (err) {
    console.error('Carfax error', err.message);
    return [];
  }
}

async function searchCarsdotcom(query) {
  const apiKey = process.env.CARSDOTCOM_API_KEY;
  if (!apiKey) return [];
  try {
    const response = await axios.get('https://api.cars.com/v1/search', {
      params: { query, api_key: apiKey },
    });
    return response.data.vehicles || [];
  } catch (err) {
    console.error('Cars.com error', err.message);
    return [];
  }
}

async function searchAllSources(query) {
  const [cg, cf, cd] = await Promise.all([
    searchCargurus(query),
    searchCarfax(query),
    searchCarsdotcom(query),
  ]);
  return [...cg, ...cf, ...cd];
}

app.post('/chat', async (req, res) => {
  const { message } = req.body;
  try {
    const chatCompletion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
    });
    const reply = chatCompletion.data.choices[0].message.content;
    if (/find cars/i.test(message)) {
      const query = message.replace(/find cars/i, '').trim();
      const cars = await searchAllSources(query);
      return res.json({ reply, cars });
    }
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error processing request' });
  }
});

app.use(express.static('public'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
