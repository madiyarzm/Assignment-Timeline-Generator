import os
import json
from openai import OpenAI

# Fail fast with a clear message if the API key isn't set.
_OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not _OPENAI_API_KEY:
    raise RuntimeError(
        "OPENAI_API_KEY environment variable is not set. "
        "For local development create a `.env` file or export the variable. "
        "Do NOT commit your real .env to git. See README for more info."
    )

client = OpenAI(api_key=_OPENAI_API_KEY)


def generate_milestones(assignment_text: str, due_date: str = None):
    """
    Generates a structured milestone plan for a given assignment.
    """

    prompt = f"""
    You are an expert productivity planner for university students.
    Your task is to break the following assignment into smaller milestones.

    Requirements:
    - Each milestone should have:
      • title (short)
      • description (1–2 sentences)
      • estimated_duration_days (integer)
    - Assume total duration until the due date is ~10–14 days.
    - Keep milestones realistic and actionable.
    - Output JSON only.

    Assignment description:
    {assignment_text}
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.4,
        max_tokens=500,
    )

    # Try to parse JSON safely
    content = response.choices[0].message.content.strip()
    try:
        milestones = json.loads(content)
    except json.JSONDecodeError:
        milestones = [
            {
                "title": "Error parsing output",
                "description": content,
                "estimated_duration_days": 0,
            }
        ]

    return milestones
