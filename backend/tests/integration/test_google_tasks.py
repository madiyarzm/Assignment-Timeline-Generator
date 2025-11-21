"""
Integration tests for Google Tasks API functions.

These tests require a valid Google access token and make real API calls.

Usage:
    export GOOGLE_ACCESS_TOKEN="your_access_token_here"
    pytest backend/tests/integration/test_google_tasks.py
"""

import os
from datetime import datetime, timedelta

import pytest

from backend.services.google_tasks import (
    create_task,
    delete_task,
    get_credentials_from_token,
    update_task_status,
)


@pytest.fixture
def access_token():
    """Get access token from environment variable."""
    token = os.getenv("GOOGLE_ACCESS_TOKEN")
    if not token:
        pytest.skip("GOOGLE_ACCESS_TOKEN not set in environment")
    return token


@pytest.fixture
def credentials(access_token):
    """Create credentials from access token."""
    return get_credentials_from_token(access_token)


@pytest.fixture
def tasklist_id():
    """Return default task list ID."""
    return "@default"


@pytest.fixture
def test_task_data():
    """Generate test task data."""
    return {
        "title": f"Test Task - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
        "notes": "This is a test task created by pytest",
        "due_date": (datetime.now() + timedelta(days=7)).strftime("%Y-%m-%dT%H:%M:%SZ"),
    }


@pytest.fixture
def created_task(credentials, tasklist_id, test_task_data):
    """Create a task for testing and clean it up after."""
    task = create_task(
        tasklist_id=tasklist_id,
        title=test_task_data["title"],
        notes=test_task_data["notes"],
        due_date=test_task_data["due_date"],
        credentials=credentials,
    )
    yield task
    # Cleanup: delete the task after test
    try:
        delete_task(
            tasklist_id=tasklist_id,
            task_id=task["id"],
            credentials=credentials,
        )
    except Exception:
        pass  # Ignore cleanup errors


class TestGoogleTasks:
    """Test suite for Google Tasks API functions."""

    def test_create_task(self, credentials, tasklist_id, test_task_data):
        """Test creating a task."""
        task = create_task(
            tasklist_id=tasklist_id,
            title=test_task_data["title"],
            notes=test_task_data["notes"],
            due_date=test_task_data["due_date"],
            credentials=credentials,
        )

        assert task is not None
        assert "id" in task
        assert task["title"] == test_task_data["title"]
        assert task["notes"] == test_task_data["notes"]
        assert task["status"] == "needsAction"

        # Cleanup
        delete_task(
            tasklist_id=tasklist_id,
            task_id=task["id"],
            credentials=credentials,
        )

    def test_create_subtask(self, credentials, tasklist_id, test_task_data):
        """Test creating a subtask with parent parameter."""
        # Create parent task
        parent_task = create_task(
            tasklist_id=tasklist_id,
            title=f"Parent Task - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
            credentials=credentials,
        )

        try:
            # Create subtask
            subtask = create_task(
                tasklist_id=tasklist_id,
                title=f"Subtask - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
                parent=parent_task["id"],
                credentials=credentials,
            )

            assert subtask is not None
            assert "id" in subtask
            assert subtask["title"].startswith("Subtask")

            # Cleanup
            delete_task(
                tasklist_id=tasklist_id,
                task_id=subtask["id"],
                credentials=credentials,
            )
        finally:
            # Cleanup parent
            delete_task(
                tasklist_id=tasklist_id,
                task_id=parent_task["id"],
                credentials=credentials,
            )

    def test_update_task_status(self, credentials, tasklist_id, created_task):
        """Test updating task status."""
        task_id = created_task["id"]

        updated_task = update_task_status(
            tasklist_id=tasklist_id,
            task_id=task_id,
            status="completed",
            credentials=credentials,
        )

        assert updated_task is not None
        assert updated_task["status"] == "completed"
        assert "completed" in updated_task
        assert updated_task["completed"] is not None

    def test_update_task_status_to_needs_action(
        self, credentials, tasklist_id, created_task
    ):
        """Test updating task status back to needsAction."""
        task_id = created_task["id"]

        # First mark as completed
        update_task_status(
            tasklist_id=tasklist_id,
            task_id=task_id,
            status="completed",
            credentials=credentials,
        )

        # Then mark as needsAction
        updated_task = update_task_status(
            tasklist_id=tasklist_id,
            task_id=task_id,
            status="needsAction",
            credentials=credentials,
        )

        assert updated_task is not None
        assert updated_task["status"] == "needsAction"

    def test_delete_task(self, credentials, tasklist_id, test_task_data):
        """Test deleting a task."""
        # Create a task to delete
        task = create_task(
            tasklist_id=tasklist_id,
            title=test_task_data["title"],
            credentials=credentials,
        )

        task_id = task["id"]

        # Delete the task
        result = delete_task(
            tasklist_id=tasklist_id,
            task_id=task_id,
            credentials=credentials,
        )

        assert result is None

    def test_delete_nonexistent_task(self, credentials, tasklist_id):
        """Test deleting a task that doesn't exist (should be idempotent)."""
        fake_task_id = "nonexistent_task_id_12345"

        # Should not raise an error (idempotent)
        result = delete_task(
            tasklist_id=tasklist_id,
            task_id=fake_task_id,
            credentials=credentials,
        )

        assert result is None
