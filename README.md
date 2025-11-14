# Assignment Timeline Generator

A full-stack web application that helps students manage their assignments by automatically breaking them down into manageable milestones using AI. The application generates intelligent task decomposition, tracks progress, and provides a visual timeline for better academic planning.

## Features

### Core Functionality

- **AI-Powered Task Decomposition**: Automatically breaks down complex assignments into smaller, actionable milestones using OpenAI's GPT models
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
│   │   └── llm_splitter.py     # AI milestone generation service
│   ├── tests/
│   │   └── test_llm_scripts.py # Unit tests
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
│   └── progress.md             # Development progress tracking
├── requirements.txt            # Python dependencies
|__.env.example                # Environment variables template
```

## Getting Started

### Prerequisites

- **Python 3.9+**
- **Node.js 14+ and npm**
- **PostgreSQL database** (Neon account recommended)
- **OpenAI API key** (for AI milestone generation)

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

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Database Configuration (Neon PostgreSQL)
DATABASE_URL=postgresql://username:password@host.neon.tech/dbname?sslmode=require

# Flask Configuration
SECRET_KEY=your-secure-random-secret-key

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key
```

**Get your Neon connection string:**

1. Go to [console.neon.tech](https://console.neon.tech)
2. Select your project
3. Copy the connection string from "Connection Details"

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
- text
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

The application uses OpenAI's GPT-4-mini model to intelligently break down assignments.

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
python -m pytest tests/
```

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

---

_Last Updated: November 14 2025_
