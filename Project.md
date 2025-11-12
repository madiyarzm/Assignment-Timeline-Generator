10.03
Technologies
Scraper options need to be evaluated (best way to extract assignment data).
UI/UX design should focus on clarity and usability + mockups.
Frontend framework options to be researched (React; need to check integration with backend).
Database options: Firebase vs SQL vs MongoDB (trade-offs in setup, scalability and integration too).
Google Calendar API integration is an important feature as well; need to confirm authentication flow and events.
Task decomposition: will we not use an LLM?; exploring heuristics/methods or some lightweight logic for splitting assignments into milestones.
AI Tools
Need a good prompt to guide research for best tasks and UI design
Testing costs estimated around $5-10 for early experiments?
UI/UX
Emphasis on timeline visualization, clarity of progress, and notifications.
Improvements to the user interface should be both ab functionality and simplicity.
Next steps
Amina - Refine UI/UX concepts; propose improvements and prepare mockups.
Marta & Anhelina - Define product features and specify system structure.
Fortune - Evaluate feasibility of Amina’s UI/UX proposals; research frontend frameworks. If time allows, also compare database options (for example Firebase vs SQL vs MongoDB).
Samuel - Google Calendar API integration and explore possible additional integrations.
Madiyar - Work on heuristic-based task decomposition (non-LLM) and timeline visualization logic.
Marta (PM) & Madiyar - Parsing & scraper module design.
Everyone - Also research effective methods for decomposing large, complex tasks into milestones (frameworks, academic papers, industry approaches etc).



10.18
Tasks for the next meetings:
Marta - setting up the Github structure file hierarchy, registration and routing when I press the button and url changes - logic
Anhelina - logic front end
Amina - design
Fortune - storage base!!
Madiyar - snippets of code + ai llm
Samuel - Calendar API + Forum + integrations

10.31
Update backend routing structure (create routes/folder and move logic out of app.py)
Add Flask endpoints:
POST /register - create new user
POST /login - user authentication
GET /assignments - return assignments for logged-in user
Set up the backend database (user table + assignments table)
Finish frontend pages and connect forms to backend endpoints
Implement logic for assignment splitting/task generation (AI/rule-based)
Explore and prototype additional “nice-to-have” features
Create feedback form to collect input from potential users
Gather initial feedback and feature ideas from early testers
Marta: Google Form created: https://docs.google.com/forms/d/e/1FAIpQLScRC__KZqWToI_cIuJJCUyQt_PrY_c8eYkq1Y3YGunve0mGrw/viewform?usp=header

