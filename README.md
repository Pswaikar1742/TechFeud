# TechFeud

A real-time web application for hosting a live game show similar to Family Feud, but with tech-themed questions. Perfect for tech meetups, conferences, or team building events.

## Features

- **Real-time Game Show**: Live presenter screen with admin controls
- **Tech-Themed Questions**: 10 carefully crafted questions about technology
- **Interactive Gameplay**: Support for 10 contestants with automatic scoring
- **Admin Dashboard**: Easy-to-use controls for game management
- **Real-time Updates**: Server-Sent Events (SSE) for instant screen updates
- **Snake Draft Turns**: Alternating turn order (1→10, then 10→1)

## Screenshots

The application consists of two main screens:
- **Presenter Screen** (`/`): Display for audience showing questions, answers, and leaderboard
- **Admin Dashboard** (`/admin`): Control panel for game management

## Quick Start

### Prerequisites

- Python 3.11+
- Flask and dependencies (see `pyproject.toml`)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Pswaikar1742/TechFeud.git
cd TechFeud
```

2. Install dependencies:
```bash
pip install -r requirements.txt
# or if using uv:
uv sync
```

3. Run the application:
```bash
python main.py
```

4. Open your browser:
   - Presenter screen: `http://localhost:5000/`
   - Admin dashboard: `http://localhost:5000/admin`

## How to Play

### Setup
1. Go to `/admin` to access the admin dashboard
2. Enter names for all 10 contestants
3. Click "Start Game" to begin

### Game Flow
1. **Select Question**: Choose from 10 tech-themed questions
2. **Control Display**: Show/hide welcome screen, questions, answers, and leaderboard
3. **Record Answers**: Click answer buttons when contestants give correct answers
4. **Manage Turns**: Use "Next Turn" to advance through contestants
5. **New Rounds**: Click "New Round" to start fresh with a new question

### Scoring
- Each question has 10 ranked answers with different point values
- Points are automatically awarded and tracked
- Leaderboard updates in real-time

## Tech Stack

- **Backend**: Flask (Python)
- **Database**: SQLite with SQLAlchemy ORM
- **Frontend**: HTML, CSS, JavaScript
- **Real-time**: Server-Sent Events (SSE)
- **Deployment**: Ready for Replit, Heroku, or similar platforms

## Project Structure

```
TechFeud/
├── app.py              # Flask application setup
├── main.py             # Application entry point
├── models.py           # Database models
├── routes.py           # API routes and endpoints
├── questions_data.py   # Game questions and answers
├── static/             # CSS and JavaScript files
├── templates/          # HTML templates
├── instance/           # Database files (excluded from git)
└── ADMIN_GUIDE.md     # Detailed admin instructions
```

## Questions Included

The game includes 10 tech-themed questions covering:
- Software and applications
- Programming languages
- Cybersecurity
- Hardware components
- Internet troubleshooting
- Tech companies
- And more!

## Contributing

Feel free to contribute by:
- Adding new questions to `questions_data.py`
- Improving the UI/UX
- Adding new features
- Fixing bugs

## License

This project is open source and available under the MIT License.

## Support

For detailed game operation instructions, see [ADMIN_GUIDE.md](ADMIN_GUIDE.md).
