# Assignment Timeline Generator

A web application for generating structured assignment timelines with AI-powered milestone breakdown.

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Assignment-Timeline-Generator
```

### 2. Install Dependencies

#### Backend (Python)
```bash
pip install -r requirements.txt
```

#### Frontend (Node.js)
```bash
cd frontend
npm install
```

### 3. Environment Variables Setup

**IMPORTANT**: API keys and sensitive configuration should be stored in a `.env` file, which is **NOT** committed to the repository.

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` and add your API key:**
   ```bash
   # Get your Anthropic API key from: https://console.anthropic.com/
   ANTHROPIC_API_KEY=your_actual_api_key_here
   ```

3. **Never commit `.env` to git** - it's already in `.gitignore`

### 4. Run the Application

#### Backend
```bash
cd backend
python main.py
```

The backend will run on `http://localhost:5000` (or the port specified in Flask config).

#### Frontend
```bash
cd frontend
npm start
```

The frontend will run on `http://localhost:3000`.

## For Contributors

When setting up the project for the first time:

1. Clone the repository
2. Install dependencies (see above)
3. **Create your own `.env` file** from `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Add your Anthropic API key to `.env`
5. Start developing!

**Note**: Each contributor needs their own API key. The `.env` file is personal and should never be shared or committed.

## Security Notes

- ✅ `.env` files are automatically ignored by git (see `.gitignore`)
- ✅ `.env.example` is committed as a template (contains no real keys)
- ✅ Never commit real API keys or secrets
- ✅ Each developer uses their own `.env` file locally

## Project Structure

```
Assignment-Timeline-Generator/
├── backend/           # Flask backend
│   ├── api/          # API routes
│   ├── database/     # Database models
│   └── services/     # Business logic (LLM integration)
├── frontend/         # React frontend
└── .env.example      # Environment variables template
```

## License

See LICENSE file for details.

