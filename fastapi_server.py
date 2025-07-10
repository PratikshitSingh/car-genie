from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import httpx
import os
from dotenv import load_dotenv
from typing import List, Dict, Any
import openai

load_dotenv()

app = FastAPI()

class ChatRequest(BaseModel):
    message: str

async def search_cargurus(query: str) -> List[Dict[str, Any]]:
    api_key = os.getenv("CARGURUS_API_KEY")
    if not api_key:
        return []
    try:
        resp = await shared_client.get(
            "https://api.cargurus.com/v1/listings",
            params={"query": query, "api_key": api_key},
            timeout=10,
        )
            resp.raise_for_status()
            data = resp.json()
            return data.get("results", [])
    except Exception as e:
        print("Cargurus error", e)
        return []

async def search_carfax(query: str) -> List[Dict[str, Any]]:
    api_key = os.getenv("CARFAX_API_KEY")
    if not api_key:
        return []
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                "https://api.carfax.com/v1/cars",
                params={"query": query, "api_key": api_key},
                timeout=10,
            )
            resp.raise_for_status()
            data = resp.json()
            return data.get("listings", [])
    except Exception as e:
        print("Carfax error", e)
        return []

async def search_carsdotcom(query: str) -> List[Dict[str, Any]]:
    api_key = os.getenv("CARSDOTCOM_API_KEY")
    if not api_key:
        return []
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                "https://api.cars.com/v1/search",
                params={"query": query, "api_key": api_key},
                timeout=10,
            )
            resp.raise_for_status()
            data = resp.json()
            return data.get("vehicles", [])
    except Exception as e:
        print("Cars.com error", e)
        return []

async def search_all_sources(query: str) -> List[Dict[str, Any]]:
    import asyncio
    results = await asyncio.gather(
        search_cargurus(query),
        search_carfax(query),
        search_carsdotcom(query),
    )
    cars: List[Dict[str, Any]] = []
    for r in results:
        cars.extend(r)
    return cars

@app.post("/api/chat")
async def chat(req: ChatRequest):
    message = req.message
    try:
        client = openai.AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        completion = await client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": message}],
        )
        reply = completion.choices[0].message.content
        if "find cars" in message.lower():
            query = message.lower().replace("find cars", "").strip()
            cars = await search_all_sources(query)
            return {"reply": reply, "cars": cars}
        return {"reply": reply}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Error processing request")

app.mount("/", StaticFiles(directory="public", html=True), name="static")


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("fastapi_server:app", host="0.0.0.0", port=port)
