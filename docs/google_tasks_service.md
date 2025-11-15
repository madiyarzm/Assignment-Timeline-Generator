# Google Tasks Service Documentation

## Overview

The `google_tasks.py` service provides functions to interact with Google Tasks API, allowing you to create, update, and delete tasks in a user's Google Tasks list. All functions use dependency injection for credentials, making them flexible and testable.

## Available Functions

- `get_credentials_from_token(access_token)` - Convert access token to Credentials object
- `create_task(tasklist_id, title, notes=None, due_date=None, credentials=None)` - Create a new task
- `update_task_status(tasklist_id, task_id, status, credentials=None)` - Update task status (needsAction/completed)
- `delete_task(tasklist_id, task_id, credentials=None)` - Delete a task

**Note:** Always use `"@default"` as the `tasklist_id` parameter - this is the default task list ID that's always available.

## Current Usage (Testing with Access Tokens)

### Setup

1. Add your Google access token to `.env` file in the repo root:
   ```
   GOOGLE_ACCESS_TOKEN=your_access_token_here
   ```

2. The service automatically loads environment variables using `load_dotenv()`.

### Example Usage

```python
from backend.services.google_tasks import (
    get_credentials_from_token,
    create_task,
    update_task_status,
    delete_task,
)
import os

# Get access token from environment
access_token = os.getenv("GOOGLE_ACCESS_TOKEN")

# Convert token to credentials
credentials = get_credentials_from_token(access_token)

# Use "@default" as the task list ID (always available)
tasklist_id = "@default"

# Create a task
task = create_task(
    tasklist_id=tasklist_id,
    title="Complete assignment research",
    notes="Research phase for the final project",
    due_date="2024-12-15T00:00:00Z",
    credentials=credentials
)

# Update task status to completed
updated_task = update_task_status(
    tasklist_id=tasklist_id,
    task_id=task["id"],
    status="completed",
    credentials=credentials
)

# Delete a task
delete_task(
    tasklist_id=tasklist_id,
    task_id=task["id"],
    credentials=credentials
)
```

## Future Usage (Full OAuth Integration)

### OAuth Flow Overview

When a user signs in with Google OAuth:

1. **User initiates login** → Redirected to Google OAuth consent screen
2. **User grants permissions** → Google redirects back with authorization code
3. **Exchange code for tokens** → Backend exchanges code for:
   - `access_token` (short-lived, ~1 hour)
   - `refresh_token` (long-lived, for getting new access tokens)
   - `token_expiry` (when access token expires)
4. **Store tokens in database** → Save encrypted tokens in User model
5. **Create Credentials object** → Use tokens to create Credentials for API calls

### Database Model Updates Needed

Add these fields to the `User` model:

```python
class User(UserMixin, db.Model):
    # ... existing fields ...
    
    # Google OAuth fields
    google_access_token = db.Column(db.Text)  # Encrypted
    google_refresh_token = db.Column(db.Text)  # Encrypted
    google_token_expiry = db.Column(db.DateTime)
    google_tasks_enabled = db.Column(db.Boolean, default=False)
```

## Function Reference

### `get_credentials_from_token(access_token)`

Converts an access token string to a Credentials object.

**Parameters:**
- `access_token` (str): OAuth2 access token

**Returns:**
- `Credentials`: Google OAuth2 credentials object

**Note:** For production, use full Credentials with refresh_token for automatic token refresh.

---

### `create_task(tasklist_id, title, notes=None, due_date=None, credentials=None)`

Creates a new task in the specified task list.

**Parameters:**
- `tasklist_id` (str): Task list ID (use `@default` for default list)
- `title` (str): Task title/name (required)
- `notes` (str, optional): Task description/notes
- `due_date` (str/datetime, optional): Due date in RFC3339 format or ISO string
- `credentials`: OAuth2 credentials object (required)

**Returns:**
- `dict`: Created task object with `id`, `title`, `notes`, `due`, `status`, etc.

**Example:**
```python
task = create_task(
    tasklist_id="@default",
    title="Research phase",
    notes="Gather information about the topic",
    due_date="2024-12-15T00:00:00Z",
    credentials=credentials
)
```

---

### `update_task_status(tasklist_id, task_id, status, credentials=None)`

Updates the status of an existing task.

**Parameters:**
- `tasklist_id` (str): Task list ID
- `task_id` (str): Task ID to update
- `status` (str): New status - either `"needsAction"` or `"completed"`
- `credentials`: OAuth2 credentials object (required)

**Returns:**
- `dict`: Updated task object

**Example:**
```python
updated_task = update_task_status(
    tasklist_id="@default",
    task_id=task["id"],
    status="completed",
    credentials=credentials
)
```

---

### `delete_task(tasklist_id, task_id, credentials=None)`

Deletes a task from the specified task list.

**Parameters:**
- `tasklist_id` (str): Task list ID
- `task_id` (str): Task ID to delete
- `credentials`: OAuth2 credentials object (required)

**Returns:**
- `None` (task is deleted)

**Example:**
```python
delete_task(
    tasklist_id="@default",
    task_id=task["id"],
    credentials=credentials
)
```

## Integration Points

### When to Use These Functions

1. **After assignment creation**: Create Google Tasks for each milestone
2. **When milestone is completed**: Update corresponding Google Task status
3. **When assignment is deleted**: Delete corresponding Google Tasks

### Example: Updating Task When Milestone Completed

```python
from backend.services.google_tasks import update_task_status

def mark_milestone_complete(milestone, user):
    """Update Google Task when milestone is completed."""
    if not user.google_tasks_enabled or not milestone.google_task_id:
        return
    
    credentials = get_user_credentials(user)
    update_task_status(
        tasklist_id="@default",
        task_id=milestone.google_task_id,
        status="completed",
        credentials=credentials
    )
```

## Error Handling

All functions raise appropriate exceptions:

- `RuntimeError`: If credentials are missing or invalid
- `HttpError`: If API request fails (check `e.resp.status` for status code)
- `ValueError`: If required parameters are missing or invalid

**Example error handling:**

```python
try:
    task = create_task(
        tasklist_id="@default",
        title="Test task",
        credentials=credentials
    )
except HttpError as e:
    if e.resp.status == 401:
        # Token expired, refresh and retry
        credentials = refresh_user_credentials(user)
        task = create_task(...)
    else:
        # Other error
        print(f"Failed to create task: {e}")
except ValueError as e:
    print(f"Invalid input: {e}")
```

## Security Considerations

1. **Encrypt stored tokens**: Never store access/refresh tokens in plain text
2. **Token refresh**: Always check token expiry and refresh when needed
3. **Scope validation**: Ensure OAuth flow requests `https://www.googleapis.com/auth/tasks` scope
4. **Error handling**: Handle expired tokens gracefully

## Notes

- All API calls automatically include proper headers (`Content-Type: application/json`, `Authorization: Bearer <token>`, etc.)
- The `@default` task list is always available - no need to create it
- Tasks appear in Google Calendar's Tasks side panel
- Access tokens expire after ~1 hour - use refresh tokens for long-term access

