"""
LLM-based assignment splitting module.

Uses Anthropic's Claude API to break down assignment descriptions into
structured, actionable milestones.
"""

import os
import json
import re
import sys
from datetime import datetime, timedelta
from typing import Optional
from anthropic import Anthropic

# Environment variables
_ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
_CLAUDE_MODEL = os.getenv("CLAUDE_MODEL", "claude-3-haiku-20240307")


def _get_client() -> Anthropic:
    """Get Anthropic client."""
    if not _ANTHROPIC_API_KEY:
        raise RuntimeError("ANTHROPIC_API_KEY environment variable is not set")
    return Anthropic(api_key=_ANTHROPIC_API_KEY)


def _parse_date(date_str: str) -> datetime:
    """Parse date string to datetime."""
    formats = ["%Y-%m-%d", "%Y/%m/%d", "%d/%m/%Y", "%m/%d/%Y"]
    for fmt in formats:
        try:
            return datetime.strptime(date_str.strip(), fmt)
        except ValueError:
            continue
    raise ValueError(f"Unable to parse date: {date_str}")


def _extract_json(content: str) -> list[dict]:
    """Extract JSON array from response."""
    content = content.strip()
    
    # Remove markdown code blocks
    json_match = re.search(r'```(?:json)?\s*(\[.*?\])\s*```', content, re.DOTALL)
    if json_match:
        content = json_match.group(1)
    
    # Find JSON array by matching brackets
    start_idx = content.find('[')
    if start_idx != -1:
        bracket_count = 0
        for i in range(start_idx, len(content)):
            if content[i] == '[':
                bracket_count += 1
            elif content[i] == ']':
                bracket_count -= 1
                if bracket_count == 0:
                    content = content[start_idx:i+1]
                    break
    
    return json.loads(content)


def _build_prompt(description: str, due_date: str, total_days: int) -> str:
    """Build LLM prompt."""
    return f"""You are an expert task-analysis researcher. Break down this assignment into 4-6 actionable milestones.

Assignment: {description}
Due Date: {due_date}
Total Days: {total_days}

Output ONLY a JSON array with this structure:
[
  {{
    "id": 1,
    "title": "Milestone Title",
    "description": "What needs to be done in this milestone (2-4 sentences).",
    "suggested_start_date": "YYYY-MM-DD",
    "suggested_end_date": "YYYY-MM-DD",
    "dependencies": []
  }}
]

Requirements:
- 4-6 milestones only
- Each milestone should be actionable and specific
- Distribute days evenly across milestones
- First milestone has no dependencies, others depend on previous ones
- Include: research, planning, drafting, revision, submission phases

Output JSON only, no other text."""


def split_assignment(description: str, due_date: str, client: Optional[Anthropic] = None) -> list[dict]:
    """Split assignment into milestones using Claude API.
    
    Args:
        description: Assignment description
        due_date: Due date (YYYY-MM-DD)
        client: Optional client for testing
        
    Returns:
        List of milestone dicts with id, title, description, dates, dependencies
    """
    # Validate inputs
    if not description or not description.strip():
        raise ValueError("Description cannot be empty")
    if not due_date or not due_date.strip():
        raise ValueError("Due date cannot be empty")
    
    # Parse and validate date
    try:
        due_dt = _parse_date(due_date)
    except ValueError as e:
        raise ValueError(f"Invalid date format: {e}")
    
    today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    due_dt = due_dt.replace(hour=0, minute=0, second=0, microsecond=0)
    
    if due_dt < today:
        raise ValueError("Due date cannot be in the past")
    
    total_days = (due_dt - today).days
    if total_days < 1:
        raise ValueError("Need at least 1 day")
    
    # Get client
    if client is None:
        client = _get_client()
    
    # Build prompt
    prompt = _build_prompt(description, due_date, total_days)
    
    # Call API
    print(f"[LLM] Calling Claude API (model: {_CLAUDE_MODEL})...", flush=True)
    
    try:
        response = client.messages.create(
            model=_CLAUDE_MODEL,
            max_tokens=4096,
            temperature=0.3,
            system="You are an expert task-analysis researcher. Always output valid JSON only.",
            messages=[{"role": "user", "content": prompt}]
        )
        
        # Extract content
        if not response.content:
            raise ValueError("Empty response from Claude API")
        
        content = response.content[0].text.strip()
        print(f"[LLM] Received response ({len(content)} chars)", flush=True)
        
        # Parse JSON
        milestones = _extract_json(content)
        print(f"[LLM] Parsed {len(milestones)} milestones", flush=True)
        
        # Validate structure
        validated = []
        for idx, m in enumerate(milestones, 1):
            validated.append({
                "id": m.get("id", idx),
                "title": m.get("title", f"Milestone {idx}"),
                "description": m.get("description", ""),
                "suggested_start_date": m.get("suggested_start_date", ""),
                "suggested_end_date": m.get("suggested_end_date", ""),
                "dependencies": m.get("dependencies", []) if isinstance(m.get("dependencies"), list) else []
            })
        
        return validated
        
    except json.JSONDecodeError as e:
        print(f"[LLM] JSON parse error: {e}", flush=True)
        raise
    except Exception as e:
        print(f"[LLM] Error: {e}", flush=True)
        raise Exception(f"Claude API error: {str(e)}") from e


if __name__ == "__main__":
    # Simple test
    sample = "Write a 3000-word research paper on AI in education. Include literature review, case studies, and recommendations."
    due = (datetime.now() + timedelta(days=30)).strftime("%Y-%m-%d")
    
    try:
        result = split_assignment(sample, due)
        print(f"\n✅ Generated {len(result)} milestones:\n")
        for m in result:
            print(f"  {m['id']}. {m['title']}")
            print(f"     {m['description'][:80]}...")
    except Exception as e:
        print(f"❌ Error: {e}")
