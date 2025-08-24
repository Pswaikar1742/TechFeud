from app import db
from datetime import datetime
import json

class GameState(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    is_active = db.Column(db.Boolean, default=False)
    current_question_id = db.Column(db.Integer, default=0)
    current_turn = db.Column(db.Integer, default=0)
    turn_direction = db.Column(db.Integer, default=1)  # 1 for forward, -1 for backward
    show_question = db.Column(db.Boolean, default=False)
    show_answers = db.Column(db.Boolean, default=False)
    show_leaderboard = db.Column(db.Boolean, default=False)
    show_welcome = db.Column(db.Boolean, default=True)
    revealed_answers = db.Column(db.Text, default='[]')  # JSON array of revealed answer indices
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def get_revealed_answers(self):
        return json.loads(self.revealed_answers)
    
    def set_revealed_answers(self, answers):
        self.revealed_answers = json.dumps(answers)

class Contestant(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    score = db.Column(db.Integer, default=0)
    position = db.Column(db.Integer, nullable=False)  # 0-9 for the 10 contestants
    game_id = db.Column(db.Integer, db.ForeignKey('game_state.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Answer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, nullable=False)
    answer_index = db.Column(db.Integer, nullable=False)  # 0-9 for the 10 answers
    contestant_id = db.Column(db.Integer, db.ForeignKey('contestant.id'), nullable=True)
    points_awarded = db.Column(db.Integer, default=0)
    game_id = db.Column(db.Integer, db.ForeignKey('game_state.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
