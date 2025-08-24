from flask import render_template, request, jsonify, redirect, url_for, Response
from app import app, db
from models import GameState, Contestant, Answer
from questions_data import questions
import json
import time

def get_or_create_game():
    game = GameState.query.first()
    if not game:
        game = GameState()
        db.session.add(game)
        db.session.commit()
    return game

@app.route('/')
def presenter():
    return render_template('index.html')

@app.route('/admin')
def admin():
    return render_template('admin.html')

@app.route('/start_game', methods=['POST'])
def start_game():
    try:
        contestant_names = request.json.get('contestants', [])
        
        if len(contestant_names) != 10:
            return jsonify({'error': 'Exactly 10 contestants required'}), 400
        
        # Clear existing contestants
        Contestant.query.delete()
        Answer.query.delete()
        
        # Create or update game state
        game = get_or_create_game()
        game.is_active = True
        game.current_question_id = 0
        game.current_turn = 0
        game.turn_direction = 1
        game.show_question = False
        game.show_answers = False
        game.show_leaderboard = False
        game.show_welcome = True
        game.set_revealed_answers([])
        
        # Create contestants
        for i, name in enumerate(contestant_names):
            if name.strip():
                contestant = Contestant(name=name.strip(), position=i, game_id=game.id)
                db.session.add(contestant)
        
        db.session.commit()
        return jsonify({'success': True})
    except Exception as e:
        app.logger.error(f"Error starting game: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/set_question', methods=['POST'])
def set_question():
    try:
        question_id = request.json.get('question_id')
        game = get_or_create_game()
        game.current_question_id = question_id
        game.set_revealed_answers([])
        db.session.commit()
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/toggle_display', methods=['POST'])
def toggle_display():
    try:
        display_type = request.json.get('type')
        value = request.json.get('value')
        
        game = get_or_create_game()
        
        if display_type == 'question':
            game.show_question = value
        elif display_type == 'answers':
            game.show_answers = value
        elif display_type == 'leaderboard':
            game.show_leaderboard = value
        elif display_type == 'welcome':
            game.show_welcome = value
        
        db.session.commit()
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/reveal_answer', methods=['POST'])
def reveal_answer():
    try:
        answer_index = request.json.get('answer_index')
        
        game = get_or_create_game()
        current_question = next((q for q in questions if q['id'] == game.current_question_id), None)
        
        if not current_question:
            return jsonify({'error': 'No current question set'}), 400
        
        # Get current contestant
        contestants = Contestant.query.order_by(Contestant.position).all()
        if not contestants:
            return jsonify({'error': 'No contestants found'}), 400
        
        current_contestant = contestants[game.current_turn]
        
        # Add points to contestant
        points = current_question['answers'][answer_index]['points']
        current_contestant.score += points
        
        # Record the answer
        answer_record = Answer(
            question_id=game.current_question_id,
            answer_index=answer_index,
            contestant_id=current_contestant.id,
            points_awarded=points,
            game_id=game.id
        )
        db.session.add(answer_record)
        
        # Reveal the answer
        revealed = game.get_revealed_answers()
        if answer_index not in revealed:
            revealed.append(answer_index)
            game.set_revealed_answers(revealed)
        
        db.session.commit()
        return jsonify({'success': True})
    except Exception as e:
        app.logger.error(f"Error revealing answer: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/no_answer', methods=['POST'])
def no_answer():
    try:
        game = get_or_create_game()
        contestants = Contestant.query.order_by(Contestant.position).all()
        
        if contestants:
            current_contestant = contestants[game.current_turn]
            # Record zero points for this turn
            answer_record = Answer(
                question_id=game.current_question_id,
                answer_index=-1,  # -1 indicates no answer
                contestant_id=current_contestant.id,
                points_awarded=0,
                game_id=game.id
            )
            db.session.add(answer_record)
        
        db.session.commit()
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/next_turn', methods=['POST'])
def next_turn():
    try:
        game = get_or_create_game()
        contestants = Contestant.query.order_by(Contestant.position).all()
        
        if not contestants:
            return jsonify({'error': 'No contestants found'}), 400
        
        # Snake draft logic
        if game.turn_direction == 1:  # Forward
            if game.current_turn < 9:
                game.current_turn += 1
            else:
                game.current_turn = 9
                game.turn_direction = -1
        else:  # Backward
            if game.current_turn > 0:
                game.current_turn -= 1
            else:
                game.current_turn = 0
                game.turn_direction = 1
        
        db.session.commit()
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/new_round', methods=['POST'])
def new_round():
    try:
        game = get_or_create_game()
        game.set_revealed_answers([])
        game.show_answers = False
        game.show_question = False
        db.session.commit()
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/game_state')
def game_state():
    try:
        game = get_or_create_game()
        contestants = Contestant.query.order_by(Contestant.position).all()
        current_question = next((q for q in questions if q['id'] == game.current_question_id), None)
        
        contestants_data = []
        for contestant in contestants:
            contestants_data.append({
                'id': contestant.id,
                'name': contestant.name,
                'score': contestant.score,
                'position': contestant.position
            })
        
        # Sort contestants by score for leaderboard
        leaderboard = sorted(contestants_data, key=lambda x: x['score'], reverse=True)
        
        current_contestant = None
        if contestants and 0 <= game.current_turn < len(contestants):
            current_contestant = contestants_data[game.current_turn]
        
        return jsonify({
            'game': {
                'is_active': game.is_active,
                'current_question_id': game.current_question_id,
                'current_turn': game.current_turn,
                'show_question': game.show_question,
                'show_answers': game.show_answers,
                'show_leaderboard': game.show_leaderboard,
                'show_welcome': game.show_welcome,
                'revealed_answers': game.get_revealed_answers()
            },
            'contestants': contestants_data,
            'leaderboard': leaderboard,
            'current_contestant': current_contestant,
            'current_question': current_question,
            'questions': questions
        })
    except Exception as e:
        app.logger.error(f"Error getting game state: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/events')
def events():
    def event_stream():
        while True:
            try:
                game = get_or_create_game()
                contestants = Contestant.query.order_by(Contestant.position).all()
                current_question = next((q for q in questions if q['id'] == game.current_question_id), None)
                
                contestants_data = []
                for contestant in contestants:
                    contestants_data.append({
                        'id': contestant.id,
                        'name': contestant.name,
                        'score': contestant.score,
                        'position': contestant.position
                    })
                
                leaderboard = sorted(contestants_data, key=lambda x: x['score'], reverse=True)
                
                current_contestant = None
                if contestants and 0 <= game.current_turn < len(contestants):
                    current_contestant = contestants_data[game.current_turn]
                
                data = {
                    'game': {
                        'is_active': game.is_active,
                        'current_question_id': game.current_question_id,
                        'current_turn': game.current_turn,
                        'show_question': game.show_question,
                        'show_answers': game.show_answers,
                        'show_leaderboard': game.show_leaderboard,
                        'show_welcome': game.show_welcome,
                        'revealed_answers': game.get_revealed_answers()
                    },
                    'contestants': contestants_data,
                    'leaderboard': leaderboard,
                    'current_contestant': current_contestant,
                    'current_question': current_question
                }
                
                yield f"data: {json.dumps(data)}\n\n"
                time.sleep(1)
            except Exception as e:
                app.logger.error(f"Error in event stream: {e}")
                yield f"data: {json.dumps({'error': str(e)})}\n\n"
                time.sleep(5)
    
    return Response(event_stream(), mimetype='text/event-stream')
