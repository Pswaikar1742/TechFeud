class TechFeudPresenter {
    constructor() {
        this.currentState = {};
        this.init();
    }

    init() {
        this.setupEventSource();
    }

    setupEventSource() {
        const eventSource = new EventSource('/events');
        
        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.error) {
                    console.error('Server error:', data.error);
                    return;
                }
                this.updateDisplay(data);
            } catch (error) {
                console.error('Error parsing server data:', error);
            }
        };

        eventSource.onerror = (error) => {
            console.error('EventSource failed:', error);
            // Attempt to reconnect after 5 seconds
            setTimeout(() => {
                this.setupEventSource();
            }, 5000);
        };
    }

    updateDisplay(data) {
        this.currentState = data;
        
        // Update current turn display
        this.updateCurrentTurn(data.current_contestant);
        
        // Update screen visibility based on game state
        this.updateScreenVisibility(data.game);
        
        // Update question display
        if (data.current_question) {
            this.updateQuestion(data.current_question);
        }
        
        // Update answer board
        if (data.current_question && data.game) {
            this.updateAnswerBoard(data.current_question, data.game.revealed_answers);
        }
        
        // Update leaderboard
        if (data.leaderboard) {
            this.updateLeaderboard(data.leaderboard);
        }
    }

    updateCurrentTurn(contestant) {
        const display = document.getElementById('current-turn-display');
        if (contestant) {
            display.textContent = contestant.name;
            display.classList.add('pulse-gold');
        } else {
            display.textContent = 'Waiting...';
            display.classList.remove('pulse-gold');
        }
    }

    updateScreenVisibility(gameState) {
        const welcomeScreen = document.getElementById('welcome-screen');
        const gameScreen = document.getElementById('game-screen');
        
        if (gameState && gameState.is_active && !gameState.show_welcome) {
            welcomeScreen.classList.add('hidden');
            gameScreen.classList.remove('hidden');
        } else {
            welcomeScreen.classList.remove('hidden');
            gameScreen.classList.add('hidden');
            return;
        }

        // Update section visibility within game screen
        const questionSection = document.getElementById('question-section');
        const answerBoard = document.getElementById('answer-board');
        const leaderboardSection = document.getElementById('leaderboard-section');

        if (gameState.show_question) {
            questionSection.classList.remove('hidden');
            questionSection.classList.add('fade-in');
        } else {
            questionSection.classList.add('hidden');
        }

        if (gameState.show_answers) {
            answerBoard.classList.remove('hidden');
            answerBoard.classList.add('fade-in');
        } else {
            answerBoard.classList.add('hidden');
        }

        if (gameState.show_leaderboard) {
            leaderboardSection.classList.remove('hidden');
            leaderboardSection.classList.add('fade-in');
        } else {
            leaderboardSection.classList.add('hidden');
        }
    }

    updateQuestion(question) {
        const questionText = document.getElementById('question-text');
        questionText.textContent = question.question;
    }

    updateAnswerBoard(question, revealedAnswers = []) {
        const leftContainer = document.getElementById('answers-left');
        const rightContainer = document.getElementById('answers-right');
        
        leftContainer.innerHTML = '';
        rightContainer.innerHTML = '';

        question.answers.forEach((answer, index) => {
            const answerCard = this.createAnswerCard(answer, index + 1, revealedAnswers.includes(index));
            
            // Distribute answers: odd numbers (1,3,5,7,9) go left, even numbers (2,4,6,8,10) go right
            if (index % 2 === 0) {
                leftContainer.appendChild(answerCard);
            } else {
                rightContainer.appendChild(answerCard);
            }
        });
    }

    createAnswerCard(answer, number, isRevealed) {
        const card = document.createElement('div');
        card.className = `answer-card ${isRevealed ? 'flip' : ''} h-20 relative`;
        
        card.innerHTML = `
            <div class="answer-card-inner h-full">
                <div class="answer-card-front">
                    <div class="text-4xl font-game text-feud-gold">${number}</div>
                </div>
                <div class="answer-card-back">
                    <div class="flex justify-between items-center w-full">
                        <div class="text-xl font-bold text-white flex-1 text-left">${answer.answer}</div>
                        <div class="text-3xl font-game text-feud-gold ml-4">${answer.points}</div>
                    </div>
                </div>
            </div>
        `;

        // Add reveal animation if needed
        if (isRevealed) {
            setTimeout(() => {
                card.classList.add('revealed');
            }, 100);
        }

        return card;
    }

    updateLeaderboard(leaderboard) {
        const container = document.getElementById('leaderboard-list');
        container.innerHTML = '';

        leaderboard.forEach((contestant, index) => {
            const item = document.createElement('div');
            item.className = `leaderboard-item flex justify-between items-center p-4 rounded-lg ${
                index === 0 ? 'bg-feud-gold text-black' : 
                index === 1 ? 'bg-gray-300 text-black' :
                index === 2 ? 'bg-yellow-600 text-white' :
                'bg-gray-700 text-white'
            }`;

            const rankIcon = index === 0 ? '👑' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;

            item.innerHTML = `
                <div class="flex items-center">
                    <span class="text-2xl mr-4">${rankIcon}</span>
                    <span class="text-2xl font-bold">${contestant.name}</span>
                </div>
                <span class="text-3xl font-game ${index === 0 ? 'high-score' : ''}">${contestant.score}</span>
            `;

            item.classList.add('slide-in-from-left');
            container.appendChild(item);
        });
    }
}

// Initialize the presenter interface when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TechFeudPresenter();
});
