# Assignment Timeline Generator

A full-stack web application that helps students manage their assignments by automatically breaking them down into manageable milestones using AI. The application generates intelligent task decomposition, tracks progress, and provides a visual timeline for better academic planning.

## Features

### Core Functionality

- **AI-Powered Task Decomposition**: Automatically breaks down complex assignments into smaller, actionable milestones using Anthropic's Claude API (or OpenAI's GPT models)
- **Progress Tracking**: Visual progress indicators for each assignment and its subtasks
- **Deadline Management**: Track assignment deadlines and milestone timelines
- **User Authentication**: Secure user registration and login with session management
- **Persistent Storage**: PostgreSQL database with Neon for reliable cloud-based data storage

## Technology Stack

### Backend

- **Framework**: Flask (Python 3.9+)
- **Database**: PostgreSQL (Neon Serverless)
- **ORM**: SQLAlchemy with Flask-SQLAlchemy
- **Authentication**: Flask-Login + Flask-Bcrypt
- **AI Integration**: OpenAI API (GPT-4-mini)
- **API**: RESTful API with CORS support

### Frontend

- **Framework**: React 18.2
- **Build Tool**: React Scripts
- **Styling**: Custom CSS
- **HTTP Client**: Fetch API with custom API wrapper

### Development Tools

- **Version Control**: Git/GitHub
- **Environment Management**: python-dotenv
- **Package Management**: pip (Backend), npm (Frontend)
- **Virtual Environment**: venv

## Project Structure (Currently)

```
Assignment-Timeline-Generator/
├── backend/
│   ├── main.py                 # Flask application entry point
│   ├── api/
│   │   └── routes/
│   │       ├── auth.py         # Authentication endpoints
│   │       ├── assignments.py  # Assignment CRUD operations
│   │       └── calendar.py     # Calendar integration (planned)
│   ├── database/
│   │   └── models.py           # SQLAlchemy models (User, Assignment, Milestone)
│   ├── services/
│   │   ├── llm_splitter.py     # AI milestone generation service
│   │   └── google_tasks.py     # Google Tasks API integration
│   ├── tests/
│   │   ├── integration/         # Integration tests (require API keys)
│   │   │   └── test_google_tasks.py
│   │   └── unit/               # Unit tests
│   └── venv/                   # Python virtual environment
│
├── frontend/
│   ├── public/
│   │   └── index.html          # HTML entry point
│   ├── src/
│   │   ├── App.jsx             # Main React component
│   │   ├── api.js              # API client wrapper
│   │   ├── styles.css          # Global styles
│   │   └── components/
│   │       ├── LandingPage.jsx
│   │       ├── LoginPage.jsx
│   │       ├── RegisterPage.jsx
│   │       ├── Dashboard.jsx
│   │       ├── AssignmentDetail.jsx
│   │       └── AddAssignmentModal.jsx
│   └── package.json
│
├── docs/
│   ├── progress.md             # Development progress tracking
│   └── google_tasks_service.md # Google Tasks API documentation
├── requirements.txt            # Python dependencies
└── .env.example                # Environment variables template
```

## Getting Started

### Prerequisites

- **Python 3.9+**
- **Node.js 14+ and npm**
- **PostgreSQL database** (Neon account recommended) or SQLite for development
- **Anthropic API key** (recommended) or **OpenAI API key** (for AI milestone generation)

### 1. Clone the Repository

```bash
git clone https://github.com/madiyarzm/Assignment-Timeline-Generator.git
cd Assignment-Timeline-Generator
```

### 2. Backend Setup

#### Install Python Dependencies

```bash
# Create and activate virtual environment
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r ../requirements.txt
```

#### Configure Environment Variables

**IMPORTANT**: API keys and sensitive configuration should be stored in a `.env` file, which is **NOT** committed to the repository.

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` with your credentials:**
   ```env
   # Database Configuration (Neon PostgreSQL or SQLite for development)
   DATABASE_URL=postgresql://username:password@host.neon.tech/dbname?sslmode=require
   # Or for SQLite (development):
   # SQLALCHEMY_DATABASE_URI=sqlite:///users.db

   # Flask Configuration
   SECRET_KEY=your-secure-random-secret-key

   # AI API Configuration (choose one or both)
   # Anthropic Claude API (recommended)
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   # Get your API key from: https://console.anthropic.com/
   
   # OpenAI Configuration (alternative)
   OPENAI_API_KEY=your-openai-api-key

   # Google Tasks API (optional - for calendar integration)
   # GOOGLE_ACCESS_TOKEN=your_google_access_token_here
   ```

**Get your Neon connection string:**

1. Go to [console.neon.tech](https://console.neon.tech)
2. Select your project
3. Copy the connection string from "Connection Details"

3. **Never commit `.env` to git** - it's already in `.gitignore`

#### Initialize the Database

```bash
# From the backend directory with venv activated
python3 main.py
```

The application will automatically create all necessary database tables on first run.

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

### 4. Running the Application

#### Start the Backend Server

```bash
cd backend
source venv/bin/activate  # Activate virtual environment
python3 main.py
```

The backend API will run on `http://localhost:5000`

#### Start the Frontend Development Server

In a new terminal:
```bash
cd frontend
npm start
```

The React app will run on `http://localhost:3000`

### 5. Verify Installation

1. Open `http://localhost:3000` in your browser
2. Register a new account
3. Create a test assignment with a description
4. Watch as AI generates milestones automatically!

## Database Schema (Currently)

### User Model

```python
- user_id (Primary Key)
- username (Unique, Indexed)
- email (Unique, Indexed)
- name
- password (Hashed with bcrypt)
```

### Assignment Model

```python
- assignment_id (Primary Key)
- user_id (Foreign Key → User)
- title
- description
- deadline
- progress (0-100)
- created_at
```

### Milestone Model

```python
- milestone_id (Primary Key)
- assignment_id (Foreign Key → Assignment)
- title
- description (Optional)
- due_date (Optional)
- google_task_id (Optional - for Google Tasks integration)
- completed (Boolean)
- order (Integer for sorting)
```

### Subtask Model

```python
- subtask_id (Primary Key)
- milestone_id (Foreign Key → Milestone)
- title
- notes (Optional)
- due_date (Optional)
- google_task_id (Optional - for Google Tasks integration)
- completed (Boolean)
- order (Integer for sorting)
```

## API Endpoints

### Authentication

- `POST /auth/signup` - Register new user
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user info

### Assignments

- `GET /assignments` - Get all user assignments
- `GET /assignments/<id>` - Get specific assignment
- `POST /assignments` - Create new assignment (with AI milestone generation)
- `PUT /assignments/<id>` - Update assignment
- `DELETE /assignments/<id>` - Delete assignment

### Health Check

- `GET /health` - API health status

## AI Milestone Generation

The application uses Anthropic's Claude API (recommended) or OpenAI's GPT models to intelligently break down assignments into structured milestones.

## Security Features

- **Password Hashing**: Bcrypt for secure password storage
- **Session Management**: Flask-Login for secure user sessions
- **CORS Protection**: Configured for specific origins
- **Environment Variables**: Sensitive data stored in `.env` (not committed)
- **SQL Injection Protection**: SQLAlchemy ORM parameterized queries
- **Database Constraints**: CASCADE deletes for referential integrity

## Testing

Run backend tests:

```bash
cd backend
source venv/bin/activate

# Run all tests
pytest tests/

# Run only integration tests
pytest tests/integration/

# Run only unit tests
pytest tests/unit/

# Run specific test file
pytest tests/integration/test_google_tasks.py
```

**Note:** Integration tests require API keys set in environment variables (e.g., `GOOGLE_ACCESS_TOKEN`). Tests will skip if keys are not available.

## Code Formatting

Format code using isort and black:

```bash
# From project root
isort .
black .
```

**Order matters:** Always run `isort` first, then `black`.

## Development Workflow

### Creating a New Feature Branch

```bash
git checkout -b feature-name
# Make your changes
git add .
git commit -m "Description of changes"
git push origin feature-name
```

### Database Migrations

After modifying models:

1. The app auto-creates tables on startup with `db.create_all()`
2. For production, consider using Flask-Migrate for proper migrations

## Configuration

### Backend Configuration (`backend/main.py`)

```python
app.config["SECRET_KEY"]                    # Flask secret key
app.config["SQLALCHEMY_DATABASE_URI"]       # PostgreSQL connection
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] # Disable to save resources
```

### CORS Configuration

Currently allows:

- `http://localhost:3000`
- `http://127.0.0.1:3000`

Modify in `backend/main.py` for production deployment.

## Troubleshooting

### OpenAI API Errors

```bash
# Verify your OPENAI_API_KEY in .env
# Check API quota at platform.openai.com
# Falls back to default milestones if API fails
```

### Frontend Won't Start

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

### Port Already in Use

```bash
# Backend (5000)
lsof -ti:5000 | xargs kill -9

# Frontend (3000)
lsof -ti:3000 | xargs kill -9
```

## Team

- **Marta** - Project Manager, Backend Architecture
- **Madiyar** - AI Integration, Task Decomposition Logic
- **Fortune** - Database Design, Backend Development
- **Amina** - UI/UX Design
- **Anhelina** - Frontend Logic
- **Samuel** - API Integrations, Calendar Features

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- **Backend**: Follow PEP 8 Python style guide
- **Frontend**: Use ESLint with React recommended rules
- **Commits**: Use clear, descriptive commit messages

## For Contributors

When setting up the project for the first time:

1. Clone the repository
2. Install dependencies (see above)
3. **Create your own `.env` file** from `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Add your Anthropic API key (or OpenAI API key) to `.env`
5. Start developing!

**Note**: Each contributor needs their own API key. The `.env` file is personal and should never be shared or committed.

## Security Notes

- ✅ `.env` files are automatically ignored by git (see `.gitignore`)
- ✅ `.env.example` is committed as a template (contains no real keys)
- ✅ Never commit real API keys or secrets
- ✅ Each developer uses their own `.env` file locally

---

_Last Updated: November 14 2025_
