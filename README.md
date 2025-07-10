# Car Genie

A simple chat-based web app for searching used cars using OpenAI's chat model.

## Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Create a `.env` file with the following keys:
   ```bash
   OPENAI_API_KEY=your-openai-key
   CARGURUS_API_KEY=your-cargurus-key
   CARFAX_API_KEY=your-carfax-key
   CARSDOTCOM_API_KEY=your-carsdotcom-key
   ```
3. Run the server:
   ```bash
   python fastapi_server.py
   ```

Open `http://localhost:8000` in your browser. The FastAPI server serves the static
chat UI and exposes the `/api/chat` endpoint used by the page.
