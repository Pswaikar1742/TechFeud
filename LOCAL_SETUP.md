# TechFeud - Local Setup Guide

## Quick Start Instructions

### Prerequisites
- Python 3.7+ installed on your system
- Command prompt or terminal access

### Step 1: Install Dependencies
Open your command prompt/terminal in the project directory and run:
```bash
pip install flask flask-sqlalchemy werkzeug sqlalchemy
```

### Step 2: Run the Application
```bash
python main.py
```

You should see output similar to:
```
* Serving Flask app 'app'
* Debug mode: on
* Running on http://127.0.0.1:5000
* Running on http://10.167.16.213:5000
```

### Step 3: Access the Application

Open your web browser and navigate to:

#### For Game Presentation (Main Screen)
```
http://127.0.0.1:5000/
```
- This is the main presenter screen that should be displayed to the audience
- Shows questions, answers, and leaderboard in real-time

#### For Game Administration (Control Panel)
```
http://127.0.0.1:5000/admin
```
- This is the admin dashboard for controlling the game
- Use this to manage contestants, questions, and game flow

### Step 4: How to Play

1. **Setup Phase:**
   - Go to the admin panel (`/admin`)
   - Enter names for all 10 contestants
   - Click "Start Game"

2. **Game Play:**
   - Select a question from the dropdown
   - Use display controls to show/hide elements on the presenter screen
   - Click answer buttons when contestants give correct answers
   - Use "Next Turn" to advance through contestants
   - Use "New Round" to start a fresh question

3. **Display Management:**
   - Keep the presenter screen (`/`) visible to the audience
   - Use the admin panel (`/admin`) to control what appears on the presenter screen

### Troubleshooting

**If you get import errors:**
```bash
pip install --upgrade flask flask-sqlalchemy
```

**If port 5000 is busy:**
- The app will automatically find another available port
- Check the terminal output for the correct URL

**To stop the server:**
- Press `Ctrl+C` in the terminal where the app is running

### Game Features
- 10 tech-themed Family Feud style questions
- Real-time scoring and leaderboard
- Snake draft turn order (1→10, then 10→1)
- Automatic point calculation
- Professional presenter display

### Files Overview
- `main.py` - Application entry point
- `app.py` - Flask application configuration
- `routes.py` - API endpoints and game logic
- `models.py` - Database models
- `questions_data.py` - Game questions and answers
- `templates/` - HTML templates
- `static/` - CSS and JavaScript files

---

**Ready to host your tech game show!** 🎮
