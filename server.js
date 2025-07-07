const express = require('express');
const axios = require('axios');
const { Configuration, OpenAIApi } = require('openai');
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.static('public'));

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages,
    });
    res.json(completion.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'OpenAI request failed' });
  }
});

app.get('/api/search', async (req, res) => {
  const { query } = req.query;
  try {
    // Placeholder for real car marketplace API integration
    const results = {
      cargurus: [],
      carfax: [],
      carscom: []
    };
    // TODO: fetch from actual services using their APIs
    res.json({ query, results });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Search request failed' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
