class TechFeudAdmin {
    constructor() {
        this.gameActive = false;
        this.currentQuestion = null;
        this.questions = [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadInitialData();
        this.pollGameState();
    }

    bindEvents() {
        // Start game button
        document.getElementById('start-game').addEventListener('click', () => {
            this.startGame();
        });

        // Question selection
        document.getElementById('question-select').addEventListener('change', (e) => {
            this.setQuestion(parseInt(e.target.value));
        });

        // Display toggles
        document.querySelectorAll('.display-toggle').forEach(button => {
            button.addEventListener('click', (e) => {
                this.toggleDisplay(e.target.dataset.type, button);
            });
        });

        // Next turn button
        document.getElementById('next-turn').addEventListener('click', () => {
            this.nextTurn();
        });

        // No answer button
        document.getElementById('no-answer').addEventListener('click', () => {
            this.noAnswer();
        });

        // New round button
        document.getElementById('new-round').addEventListener('click', () => {
            this.newRound();
        });
    }

    async loadInitialData() {
        try {
            const response = await fetch('/game_state');
            const data = await response.json();
            
            if (data.questions) {
                this.questions = data.questions;
                this.populateQuestionSelect();
            }
            
            this.updateUI(data);
        } catch (error) {
            this.showMessage('Error loading initial data: ' + error.message, 'error');
        }
    }

    populateQuestionSelect() {
        const select = document.getElementById('question-select');
        select.innerHTML = '<option value="">Choose a question...</option>';
        
        this.questions.forEach(question => {
            const option = document.createElement('option');
            option.value = question.id;
            option.textContent = `Q${question.id}: ${question.question.substring(0, 50)}...`;
            select.appendChild(option);
        });
    }

    async startGame() {
        const contestants = [];
        document.querySelectorAll('.contestant-input').forEach(input => {
            if (input.value.trim()) {
                contestants.push(input.value.trim());
            }
        });

        if (contestants.length !== 10) {
            this.showMessage('Please enter exactly 10 contestant names', 'error');
            return;
        }

        try {
            const response = await fetch('/start_game', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ contestants })
            });

            const result = await response.json();
            
            if (result.success) {
                this.gameActive = true;
                this.enableGameControls();
                this.showMessage('Game started successfully!', 'success');
            } else {
                this.showMessage('Error starting game: ' + result.error, 'error');
            }
        } catch (error) {
            this.showMessage('Error starting game: ' + error.message, 'error');
        }
    }

    async setQuestion(questionId) {
        if (!questionId) return;

        try {
            const response = await fetch('/set_question', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question_id: questionId })
            });

            const result = await response.json();
            
            if (result.success) {
                this.currentQuestion = this.questions.find(q => q.id === questionId);
                this.populateAnswerButtons();
                this.showMessage('Question set successfully!', 'success');
            } else {
                this.showMessage('Error setting question: ' + result.error, 'error');
            }
        } catch (error) {
            this.showMessage('Error setting question: ' + error.message, 'error');
        }
    }

    populateAnswerButtons() {
        const container = document.getElementById('answer-buttons');
        container.innerHTML = '';

        if (!this.currentQuestion) return;

        this.currentQuestion.answers.forEach((answer, index) => {
            const button = document.createElement('button');
            button.className = 'answer-btn bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors text-sm';
            button.innerHTML = `
                <div class="text-lg font-bold">${index + 1}</div>
                <div class="text-xs">${answer.answer}</div>
                <div class="text-sm text-blue-200">${answer.points} pts</div>
            `;
            button.addEventListener('click', () => this.revealAnswer(index));
            container.appendChild(button);
        });
    }

    async revealAnswer(answerIndex) {
        try {
            const response = await fetch('/reveal_answer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ answer_index: answerIndex })
            });

            const result = await response.json();
            
            if (result.success) {
                // Disable the button
                const buttons = document.querySelectorAll('.answer-btn');
                buttons[answerIndex].classList.add('disabled');
                buttons[answerIndex].disabled = true;
                this.showMessage('Answer revealed!', 'success');
            } else {
                this.showMessage('Error revealing answer: ' + result.error, 'error');
            }
        } catch (error) {
            this.showMessage('Error revealing answer: ' + error.message, 'error');
        }
    }

    async noAnswer() {
        try {
            const response = await fetch('/no_answer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const result = await response.json();
            
            if (result.success) {
                this.showMessage('No answer recorded', 'info');
            } else {
                this.showMessage('Error recording no answer: ' + result.error, 'error');
            }
        } catch (error) {
            this.showMessage('Error recording no answer: ' + error.message, 'error');
        }
    }

    async nextTurn() {
        try {
            const response = await fetch('/next_turn', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const result = await response.json();
            
            if (result.success) {
                this.showMessage('Turn advanced', 'success');
            } else {
                this.showMessage('Error advancing turn: ' + result.error, 'error');
            }
        } catch (error) {
            this.showMessage('Error advancing turn: ' + error.message, 'error');
        }
    }

    async newRound() {
        try {
            const response = await fetch('/new_round', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const result = await response.json();
            
            if (result.success) {
                // Re-enable all answer buttons
                document.querySelectorAll('.answer-btn').forEach(button => {
                    button.classList.remove('disabled');
                    button.disabled = false;
                });
                this.showMessage('New round started!', 'success');
            } else {
                this.showMessage('Error starting new round: ' + result.error, 'error');
            }
        } catch (error) {
            this.showMessage('Error starting new round: ' + error.message, 'error');
        }
    }

    async toggleDisplay(type, button) {
        const isActive = button.classList.contains('active');
        const newValue = !isActive;

        try {
            const response = await fetch('/toggle_display', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ type, value: newValue })
            });

            const result = await response.json();
            
            if (result.success) {
                if (newValue) {
                    button.classList.add('active');
                    button.textContent = button.textContent.replace('Show', 'Hide');
                } else {
                    button.classList.remove('active');
                    button.textContent = button.textContent.replace('Hide', 'Show');
                }
            } else {
                this.showMessage('Error toggling display: ' + result.error, 'error');
            }
        } catch (error) {
            this.showMessage('Error toggling display: ' + error.message, 'error');
        }
    }

    enableGameControls() {
        document.getElementById('question-select').disabled = false;
        document.getElementById('next-turn').disabled = false;
        document.getElementById('no-answer').disabled = false;
        document.getElementById('new-round').disabled = false;
        document.querySelectorAll('.display-toggle').forEach(button => {
            button.disabled = false;
        });
    }

    updateUI(data) {
        if (data.current_contestant) {
            document.getElementById('current-turn').textContent = data.current_contestant.name;
        }

        if (data.game && data.game.current_question_id) {
            document.getElementById('question-select').value = data.game.current_question_id;
        }

        // Update display toggle states
        const toggles = {
            'welcome': data.game?.show_welcome,
            'question': data.game?.show_question,
            'answers': data.game?.show_answers,
            'leaderboard': data.game?.show_leaderboard
        };

        Object.entries(toggles).forEach(([type, isActive]) => {
            const button = document.querySelector(`[data-type="${type}"]`);
            if (button) {
                if (isActive) {
                    button.classList.add('active');
                    button.textContent = button.textContent.replace('Show', 'Hide');
                } else {
                    button.classList.remove('active');
                    button.textContent = button.textContent.replace('Hide', 'Show');
                }
            }
        });
    }

    pollGameState() {
        setInterval(async () => {
            try {
                const response = await fetch('/game_state');
                const data = await response.json();
                this.updateUI(data);
            } catch (error) {
                console.error('Error polling game state:', error);
            }
        }, 2000);
    }

    showMessage(message, type = 'info') {
        const container = document.getElementById('status-messages');
        const alertDiv = document.createElement('div');
        
        const colorClasses = {
            success: 'bg-green-600',
            error: 'bg-red-600',
            info: 'bg-blue-600'
        };

        alertDiv.className = `${colorClasses[type]} text-white px-4 py-2 rounded-lg mb-2 transition-all duration-500`;
        alertDiv.textContent = message;

        container.appendChild(alertDiv);

        // Auto remove after 5 seconds
        setTimeout(() => {
            alertDiv.style.opacity = '0';
            setTimeout(() => {
                if (alertDiv.parentNode) {
                    alertDiv.parentNode.removeChild(alertDiv);
                }
            }, 500);
        }, 5000);
    }
}

// Initialize the admin interface when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TechFeudAdmin();
});
