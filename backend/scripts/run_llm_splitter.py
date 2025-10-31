#!/usr/bin/env python3
"""
Small runnable example for `generate_milestones` in
`backend/core/routes/modules/llm_splitter.py`.

Usage:
  - Mock mode (no API key required):
      python backend/scripts/run_llm_splitter.py --mock

  - Real mode (requires OPENAI_API_KEY in environment or in .env):
      # create .env with OPENAI_API_KEY or export the variable
      python backend/scripts/run_llm_splitter.py

This script supports a simple dependency-injection mock so you can test the
JSON parsing behaviour without making real API calls.
"""
import argparse
import json
import sys
from types import SimpleNamespace
from pathlib import Path

from dotenv import load_dotenv


def make_mock_client(json_text: str):
    """Return a fake client that mimics the minimal shape used by
    `generate_milestones`.
    """

    def create(**kwargs):
        return SimpleNamespace(
            choices=[SimpleNamespace(message=SimpleNamespace(content=json_text))]
        )

    return SimpleNamespace(
        chat=SimpleNamespace(completions=SimpleNamespace(create=create))
    )


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--mock", action="store_true", help="Run with a fake LLM response"
    )
    parser.add_argument(
        "--assignment-file", type=str, help="Path to file containing assignment text"
    )
    args = parser.parse_args()

    # Ensure repo root is on sys.path so imports like
    # backend.core.routes.modules.llm_splitter work regardless of CWD
    repo_root = Path(__file__).resolve().parents[2]
    sys.path.insert(0, str(repo_root))

    # Load .env from repo root if present (local dev convenience)
    load_dotenv(dotenv_path=repo_root / ".env")

    # Import here so env vars are loaded first
    try:
        from backend.core.routes.modules.llm_splitter import generate_milestones
    except Exception as e:
        print("Failed to import generate_milestones:", e)
        sys.exit(1)

    if args.assignment_file:
        assignment_text = Path(args.assignment_file).read_text()
    else:
        assignment_text = (
            "Write a 2500-word essay on the causes and consequences of climate "
            "change, including at least 5 academic references. Deadline in two weeks."
        )

    if args.mock:
        # Provide a deterministic JSON string similar to what the real model
        # would return so we can test JSON parsing and output formatting.
        mock_output = json.dumps(
            [
                {
                    "title": "Understand the prompt",
                    "description": "Read the assignment and identify required sections and references.",
                    "estimated_duration_days": 1,
                },
                {
                    "title": "Research & sources",
                    "description": "Collect at least 5 academic references and take notes.",
                    "estimated_duration_days": 4,
                },
                {
                    "title": "Drafting",
                    "description": "Write the first full draft of the essay.",
                    "estimated_duration_days": 5,
                },
                {
                    "title": "Revision & citations",
                    "description": "Edit the draft, check citations and formatting.",
                    "estimated_duration_days": 3,
                },
            ]
        )

        client = make_mock_client(mock_output)
        milestones = generate_milestones(assignment_text, client=client)
    else:
        try:
            milestones = generate_milestones(assignment_text)
        except Exception as e:
            print("Error calling generate_milestones:", e)
            sys.exit(1)

    print(json.dumps(milestones, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
