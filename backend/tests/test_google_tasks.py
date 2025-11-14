"""
Test script for Google Tasks API functions.

Usage:
    export GOOGLE_ACCESS_TOKEN="your_access_token_here"
    python backend/tests/test_google_tasks.py
"""

import os
import sys
from datetime import datetime, timedelta

# Add parent directory to path to import backend modules
sys.path.insert(
    0,
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")),
)

from backend.services.google_tasks import (
    create_task,  # noqa: E402
    delete_task,
    get_credentials_from_token,
    update_task_status,
)


def main():
    """Main test function."""
    # Get access token from environment variable
    access_token = os.getenv("GOOGLE_ACCESS_TOKEN")
    if not access_token:
        print("ERROR: GOOGLE_ACCESS_TOKEN environment variable not set")
        print("Usage: export GOOGLE_ACCESS_TOKEN='your_token_here'")
        sys.exit(1)

    print("=" * 60)
    print("Testing Google Tasks API Functions")
    print("=" * 60)
    print()

    # Convert token to credentials
    print("1. Converting access token to credentials...")
    credentials = get_credentials_from_token(access_token)
    print("   ✓ Credentials created")
    print()

    # Use default task list (always available, no API call needed)
    print("2. Using default task list...")
    tasklist_id = "@default"
    print(f"   ✓ Using task list ID: {tasklist_id}")
    print()

    # Test creating a task
    print("3. Testing create_task()...")
    test_title = f"Test Task - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
    test_notes = "This is a test task created by the test script"
    test_due_date = (datetime.now() + timedelta(days=7)).strftime("%Y-%m-%dT%H:%M:%SZ")

    try:
        created_task = create_task(
            tasklist_id=tasklist_id,
            title=test_title,
            notes=test_notes,
            due_date=test_due_date,
            credentials=credentials,
        )
        task_id = created_task.get("id")
        print("   ✓ Task created successfully!")
        print(f"      Task ID: {task_id}")
        print(f"      Title: {created_task.get('title')}")
        print(f"      Status: {created_task.get('status')}")
        print(f"      Due: {created_task.get('due')}")
        print()
    except Exception as e:
        print(f"   ✗ Failed to create task: {e}")
        sys.exit(1)

    # Test updating task status
    print("4. Testing update_task_status()...")
    try:
        updated_task = update_task_status(
            tasklist_id=tasklist_id,
            task_id=task_id,
            status="completed",
            credentials=credentials,
        )
        print("   ✓ Task status updated successfully!")
        print(f"      Status: {updated_task.get('status')}")
        print(f"      Completed: {updated_task.get('completed')}")
        print()
    except Exception as e:
        print(f"   ✗ Failed to update task status: {e}")
        print("   (Task was created but status update failed)")
        print()

    # Test deleting the task
    print("5. Testing delete_task()...")
    try:
        delete_task(
            tasklist_id=tasklist_id,
            task_id=task_id,
            credentials=credentials,
        )
        print("   ✓ Task deleted successfully!")
        print()
    except Exception as e:
        print(f"   ✗ Failed to delete task: {e}")
        print("   (Task may still exist in your Google Tasks)")
        print()

    # Summary
    print("=" * 60)
    print("All tests completed!")
    print("=" * 60)
    print()
    print("You can verify in Google Tasks that:")
    print("  1. A task was created")
    print("  2. It was marked as completed")
    print("  3. It was deleted")
    print()


if __name__ == "__main__":
    main()
