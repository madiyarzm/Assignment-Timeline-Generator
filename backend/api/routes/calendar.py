"""
Calendar API routes.

Handles endpoints for syncing generated milestones with external calendar services (e.g., Google Calendar):

- POST /calendar/sync/{assignment_id}    → Sync milestones of an assignment to a user's calendar
- GET /calendar/auth                     → Authenticate users via OAuth
- PUT /calendar/events/{event_id}        → Update a calendar event
- DELETE /calendar/events/{event_id}     → Delete a calendar event

All routes should:
- Validate input using Pydantic schemas where applicable
- Interact with external calendar APIs safely
- Return structured JSON responses confirming success or failure

This file is optional for the MVP and can be added when implementing calendar integration.
"""
