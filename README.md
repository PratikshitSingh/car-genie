# Car Genie

A simple web app that uses OpenAI's GPT model and third-party APIs to search for used cars.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file with the following keys:
   ```bash
   OPENAI_API_KEY=your-openai-key
   CARGURUS_API_KEY=your-cargurus-key
   CARFAX_API_KEY=your-carfax-key
   CARSDOTCOM_API_KEY=your-carsdotcom-key
   ```
3. Run the app:
   ```bash
   npm start
   ```

Open `http://localhost:3000` to interact with the chat UI. Ask things like:

```
find cars Honda Civic 2018
```

The server will use the provided API keys to gather listings from Cargurus, Carfax and cars.com.
