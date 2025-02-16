class MemoryGame {
    constructor() {
        this.colors = ['red', 'blue', 'green', 'yellow'];
        this.symbols = ['★', '■', '▲', '●', '♦', '⬡', '⬢', '▼'];
        this.cards = [];
        this.selectedCards = [];
        this.level = 0;
        this.score = 0;
        this.gameStarted = false;
        this.isRevealed = false;

        this.startButton = document.getElementById('startButton');
        this.cardGrid = document.getElementById('cardGrid');
        this.messageEl = document.getElementById('message');
        this.levelInfoEl = document.getElementById('levelInfo');

        this.startButton.addEventListener('click', () => this.initializeGame());
    }

    createLevelCards() {
        const currentColor = this.colors[this.level];
        const currentSymbol = this.symbols[this.level % this.symbols.length];
        const cards = [];

        // Add 3 matching cards
        for (let i = 0; i < 3; i++) {
            cards.push({
                id: `${currentColor}-${i}`,
                color: currentColor,
                symbol: currentSymbol,
                isFlipped: false
            });
        }

        // Add 6 distractor cards
        const otherColors = this.colors.filter(c => c !== currentColor);
        for (let i = 0; i < 6; i++) {
            const distractorColor = otherColors[i % otherColors.length];
            const distractorSymbol = this.symbols[(this.level + i + 1) % this.symbols.length];
            cards.push({
                id: `distractor-${i}`,
                color: distractorColor,
                symbol: distractorSymbol,
                isFlipped: false
            });
        }

        return cards.sort(() => Math.random() - 0.5);
    }

    initializeGame() {
        this.level = 0;
        this.score = 0;
        this.gameStarted = true;
        this.startLevel();
    }

    startLevel() {
        this.cards = this.createLevelCards();
        this.selectedCards = [];
        this.isRevealed = true;
        this.renderCards();
        this.updateMessage(`Level ${this.level + 1}: Find 3 matching ${this.colors[this.level]} cards`);
        this.updateLevelInfo();

        // Hide cards after 5 seconds
        setTimeout(() => {
            this.isRevealed = false;
            this.renderCards();
        }, 5000);
    }

    renderCards() {
        this.cardGrid.innerHTML = '';
        this.cards.forEach(card => {
            const cardEl = document.createElement('div');
            cardEl.classList.add('card');
            
            if (this.isRevealed || card.isFlipped) {
                cardEl.classList.add('revealed');
                cardEl.style.color = card.color;
                cardEl.textContent = card.symbol;
            } else {
                cardEl.textContent = '?';
            }

            cardEl.addEventListener('click', () => this.handleCardClick(card));
            this.cardGrid.appendChild(cardEl);
        });
    }

    handleCardClick(card) {
        if (!this.gameStarted || this.isRevealed || card.isFlipped) return;

        // Only allow selecting cards of the current level's color
        if (card.color !== this.colors[this.level]) {
            this.updateMessage(`Please select ${this.colors[this.level]} cards for this level`);
            return;
        }

        card.isFlipped = true;
        this.selectedCards.push(card);
        this.renderCards();

        if (this.selectedCards.length === 3) {
            setTimeout(() => this.checkMatch(), 1000);
        }
    }

    checkMatch() {
        const correctColor = this.selectedCards.every(card => card.color === this.colors[this.level]);
        const matchingSymbols = this.selectedCards.every(card => card.symbol === this.selectedCards[0].symbol);
        const allMatch = correctColor && matchingSymbols;

        if (allMatch) {
            this.score++;
            
            if (this.level + 1 < this.colors.length) {
                this.level++;
                this.updateMessage('Great job! Starting next level...');
                setTimeout(() => this.startLevel(), 2000);
            } else {
                this.updateMessage('Congratulations! You completed all levels!');
                this.gameStarted = false;
            }
        } else {
            this.selectedCards.forEach(card => card.isFlipped = false);
            this.updateMessage(`Try again! Find 3 matching ${this.colors[this.level]} cards`);
        }

        this.selectedCards = [];
        this.renderCards();
        this.updateLevelInfo();
    }

    updateMessage(message) {
        this.messageEl.textContent = message;
    }

    updateLevelInfo() {
        this.levelInfoEl.textContent = `Level: ${this.level + 1} | Score: ${this.score}/${this.colors.length}`;
    }
}

// Initialize the game
new MemoryGame();