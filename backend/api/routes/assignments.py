"""
Assignments API routes.

Handles all endpoints related to assignments and their milestones:

- POST /assignments         → Create a new assignment and generate milestones via LLM
- GET /assignments          → Retrieve all assignments
- GET /assignments/{id}     → Retrieve a specific assignment and its milestones
- DELETE /assignments/{id}  → Delete an assignment and its milestones

All routes should:
- Call the LLM service to split assignment descriptions into milestones
- Return structured JSON responses containing assignment and milestone data
"""
