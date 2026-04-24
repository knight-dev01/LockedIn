"""
LockedIn AI Parser Service
Uses OpenRouter for text parsing ONLY — never for truth decisions.
Safe use: extract structured data, parse CVs, detect inconsistencies (flag only).
"""
import httpx
import json
from typing import Optional

from app.core.config import get_settings

settings = get_settings()

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"


async def parse_cv_text(cv_text: str) -> Optional[dict]:
    """
    Parse CV/resume text into structured data.
    AI extracts data — does NOT verify truth.
    """
    if not settings.OPENROUTER_API_KEY:
        return None

    prompt = f"""Extract structured professional data from this CV/resume text.
Return a JSON object with these fields:
- name: string
- headline: string (professional title)
- experiences: array of {{title, company, start_date, end_date, description}}
- educations: array of {{institution, degree, field_of_study, start_date, end_date}}
- skills: array of strings
- certifications: array of {{title, issuer, date}}

CV Text:
{cv_text[:4000]}

Return ONLY valid JSON, no explanation."""

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                OPENROUTER_URL,
                headers={
                    "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "google/gemini-2.0-flash-001",
                    "messages": [{"role": "user", "content": prompt}],
                    "temperature": 0.1,
                },
            )
            if resp.status_code == 200:
                result = resp.json()
                content = result["choices"][0]["message"]["content"]
                # Try to parse as JSON
                content = content.strip()
                if content.startswith("```"):
                    content = content.split("\n", 1)[1].rsplit("```", 1)[0]
                return json.loads(content)

    except Exception as e:
        print(f"AI parser error: {e}")

    return None


async def detect_inconsistencies(claims: list, scraped_data: dict) -> list:
    """
    Use AI to flag potential inconsistencies between claims and scraped data.
    FLAGS ONLY — does not make truth decisions.
    """
    if not settings.OPENROUTER_API_KEY:
        return []

    prompt = f"""Compare these professional claims against scraped profile data.
Flag any inconsistencies (date overlaps, title mismatches, missing entries).
Return a JSON array of flag objects: [{{claim_title, issue, severity: "low"/"medium"/"high"}}]

Claims: {json.dumps(claims[:10])}
Scraped Data: {json.dumps(scraped_data)}

Return ONLY valid JSON array, no explanation."""

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                OPENROUTER_URL,
                headers={
                    "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "google/gemini-2.0-flash-001",
                    "messages": [{"role": "user", "content": prompt}],
                    "temperature": 0.1,
                },
            )
            if resp.status_code == 200:
                result = resp.json()
                content = result["choices"][0]["message"]["content"]
                content = content.strip()
                if content.startswith("```"):
                    content = content.split("\n", 1)[1].rsplit("```", 1)[0]
                return json.loads(content)

    except Exception as e:
        print(f"AI inconsistency detection error: {e}")

    return []
