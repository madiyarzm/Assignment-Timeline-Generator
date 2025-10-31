import os
import json
from openai import OpenAI

# Lazy client initialization and dependency injection
# This avoids raising at import time so test/mocking scripts can import this module
# without an API key. The client will be created on first real use (or you can
# pass a `client=` to `generate_milestones` for testing).
_OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


def _get_client():
    """Return an OpenAI client initialized from the OPENAI_API_KEY env var.

    Raises RuntimeError if the key is missing. This is only raised when the
    client is actually needed (call-time), not at import-time.
    """
    if not _OPENAI_API_KEY:
        raise RuntimeError(
            "OPENAI_API_KEY environment variable is not set. "
            "For local development create a `.env` file or export the variable. "
            "Do NOT commit your real .env to git. See README for more info."
        )
    return OpenAI(api_key=_OPENAI_API_KEY)


def generate_milestones(assignment_text: str, due_date: str = None, client=None):
    """
    Generates a structured milestone plan for a given assignment.
    """

    prompt = f"""
    You are an expert productivity planner for university students.
    Your task is to break the following assignment into smaller milestones.

    Requirements:
    - Each milestone should have:
      • title (short)
      • description (4 sentences)
      • duration_days (integer)
    - Get total duration until the due date from the variable passed.
    - Keep milestones realistic and actionable.
    - Output JSON only.

    Assignment description:
    {assignment_text}
    """

    # allow dependency injection for easier testing/mocking
    if client is None:
        client = _get_client()

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
