"""
Google Tasks API service.

Provides functions to interact with Google Tasks API:
- Creating tasks
- Updating task status (completed/needsAction)
- Deleting tasks

All functions accept a `credentials` parameter for dependency injection,
allowing for easier testing and flexible authentication handling.
"""

from datetime import datetime

from dotenv import load_dotenv
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

load_dotenv()


def get_credentials_from_token(access_token):
    """
    Convert an access token to a Credentials object.

    This utility function creates Google OAuth2 credentials from an access
    token string. Useful for testing and simple authentication scenarios.

    Args:
        access_token: OAuth2 access token string

    Returns:
        Credentials object for use with Google API client

    Note:
        For production use, you should also include refresh_token and
        token_uri for token refresh capabilities.
    """
    credentials = Credentials(token=access_token)
    return credentials


def _get_tasks_service(credentials):
    """
    Build and return a Google Tasks API service instance.

    Args:
        credentials: OAuth2 credentials object with valid access token

    Returns:
        Google Tasks API service instance

    Raises:
        RuntimeError: If credentials are invalid or missing
    """
    if not credentials:
        raise RuntimeError(
            "Google Tasks credentials are required. "
            "Ensure OAuth2 authentication is completed and "
            "credentials are available."
        )

    try:
        service = build("tasks", "v1", credentials=credentials)
        return service
    except Exception as e:
        raise RuntimeError(f"Failed to build Google Tasks service: {e}")


def create_task(
    tasklist_id,
    title,
    notes=None,
    due_date=None,
    parent=None,
    credentials=None,
):
    """
    Create a new task in the specified task list.

    Args:
        tasklist_id: ID of the task list to add the task to
        title: Title/name of the task (required)
        notes: Description/notes for the task (optional)
        due_date: Due date in RFC3339 format
                  (e.g., "2024-12-15T00:00:00Z") or ISO format string
                  (optional)
        parent: Parent task ID to create this as a subtask (optional)
        credentials: OAuth2 credentials object (required)

    Returns:
        dict: Created task object with id, title, notes, due, status, etc.

    Raises:
        RuntimeError: If credentials are missing or invalid
        HttpError: If API request fails
        ValueError: If title is missing or tasklist_id is invalid
    """
    if not title:
        raise ValueError("Task title is required")

    if not tasklist_id:
        raise ValueError("Task list ID is required")

    service = _get_tasks_service(credentials)

    task_body = {"title": title, "status": "needsAction"}

    if notes:
        task_body["notes"] = notes

    if due_date:
        if isinstance(due_date, str):
            try:
                if "T" in due_date:
                    task_body["due"] = due_date
                else:
                    parsed_date = datetime.fromisoformat(
                        due_date.replace("Z", "+00:00")
                    )
                    task_body["due"] = parsed_date.strftime("%Y-%m-%dT%H:%M:%SZ")
            except ValueError:
                task_body["due"] = due_date
        elif isinstance(due_date, datetime):
            task_body["due"] = due_date.strftime("%Y-%m-%dT%H:%M:%SZ")

    if parent:
        task_body["parent"] = parent

    try:
        task = service.tasks().insert(tasklist=tasklist_id, body=task_body).execute()

        return task
    except HttpError as e:
        error_msg = e.error_details if hasattr(e, "error_details") else str(e)
        raise HttpError(
            e.resp.status,
            f"Failed to create task: {error_msg}",
        )


def update_task_status(tasklist_id, task_id, status, credentials=None):
    """
    Update the status of an existing task.

    Args:
        tasklist_id: ID of the task list containing the task
        task_id: ID of the task to update
        status: New status - either "needsAction" or "completed"
        credentials: OAuth2 credentials object (required)

    Returns:
        dict: Updated task object

    Raises:
        RuntimeError: If credentials are missing or invalid
        HttpError: If API request fails
        ValueError: If status is invalid or IDs are missing
    """
    if status not in ["needsAction", "completed"]:
        raise ValueError(
            f"Invalid status: {status}. Must be 'needsAction' or 'completed'"
        )

    if not tasklist_id:
        raise ValueError("Task list ID is required")

    if not task_id:
        raise ValueError("Task ID is required")

    service = _get_tasks_service(credentials)

    task_body = {"status": status}

    if status == "completed":
        task_body["completed"] = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")

    try:
        task = (
            service.tasks()
            .patch(tasklist=tasklist_id, task=task_id, body=task_body)
            .execute()
        )

        return task
    except HttpError as e:
        error_msg = e.error_details if hasattr(e, "error_details") else str(e)
        raise HttpError(
            e.resp.status,
            f"Failed to update task status: {error_msg}",
        )


def delete_task(tasklist_id, task_id, credentials=None):
    """
    Delete a task from the specified task list.

    Args:
        tasklist_id: ID of the task list containing the task
        task_id: ID of the task to delete
        credentials: OAuth2 credentials object (required)

    Returns:
        None (task is deleted)

    Raises:
        RuntimeError: If credentials are missing or invalid
        HttpError: If API request fails
        ValueError: If IDs are missing
    """
    if not tasklist_id:
        raise ValueError("Task list ID is required")

    if not task_id:
        raise ValueError("Task ID is required")

    service = _get_tasks_service(credentials)

    try:
        service.tasks().delete(tasklist=tasklist_id, task=task_id).execute()
        return None
    except HttpError as e:
        if e.resp.status == 404:
            return None

        error_msg = e.error_details if hasattr(e, "error_details") else str(e)
        raise HttpError(
            e.resp.status,
            f"Failed to delete task: {error_msg}",
        )
