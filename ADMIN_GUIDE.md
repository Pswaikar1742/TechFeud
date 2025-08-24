# Tech Feud Admin Guide

## How to Access the Admin Dashboard

To access the admin control panel, go to: **`/admin`**

If your app is running locally, visit: `http://localhost:5000/admin`
If your app is deployed, visit: `https://your-app-url.replit.app/admin`

## Getting Started

### 1. Setting Up Contestants
- Enter the names of all 10 contestants in the input fields
- All 10 fields must be filled before starting the game
- Click **"Start Game"** to begin

### 2. Selecting Questions
- Once the game starts, choose a question from the dropdown menu
- There are 10 tech-themed questions available
- Each question has 10 ranked answers with different point values

### 3. Managing the Presenter Screen
Use the display control buttons to show/hide different sections on the presenter screen:
- **Show/Hide Welcome**: Controls the welcome screen
- **Show/Hide Question**: Displays the current question
- **Show/Hide Answers**: Shows the answer board
- **Show/Hide Leaderboard**: Displays contestant rankings

## Game Flow

### Turn Management
- The **"Current Turn"** section shows whose turn it is
- Uses a "snake draft" pattern: 1→2→3...→10, then 10→9→8...→1, then repeat
- Click **"Next Turn"** to advance to the next contestant

### Recording Answers
When a contestant gives an answer:

#### If they give a correct answer:
1. Click the corresponding answer button (shows the answer text and points)
2. The answer will be revealed on the presenter screen
3. Points are automatically added to the contestant's score
4. The button becomes disabled for this round

#### If they give no answer or wrong answer:
1. Click the **"NO ANSWER / WRONG"** button
2. The contestant gets 0 points for their turn
3. Their turn ends immediately

### Round Management
- After all contestants have answered, click **"New Round"** to:
  - Clear the answer board on presenter screen
  - Re-enable all answer buttons for the next question
  - Keep contestant scores intact
- Select a new question from the dropdown for the next round

## Game Controls Summary

| Control | Function |
|---------|----------|
| Start Game | Initialize game with 10 contestants |
| Question Dropdown | Select which question to display |
| Answer Buttons (1-10) | Reveal correct answers and award points |
| NO ANSWER / WRONG | Give 0 points and end turn |
| Next Turn | Advance to next contestant |
| New Round | Clear board for next question |
| Display Toggles | Control what appears on presenter screen |

## Tips for Smooth Game Operation

1. **Before Starting**: Have all contestant names ready
2. **During Game**: Keep the presenter screen visible to audience while using admin controls
3. **Question Selection**: You can jump to any question at any time
4. **Real-time Updates**: Changes appear instantly on the presenter screen
5. **Scoring**: Leaderboard updates automatically as points are awarded

## Technical Notes

- The admin dashboard works in real-time with the presenter screen
- No internet connection required once loaded
- Game state is automatically saved
- If browser refreshes, game state is preserved

---

*The presenter screen should be displayed on a large screen/projector for the audience and contestants to see.*