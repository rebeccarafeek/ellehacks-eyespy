class EyeSpy {
    constructor() {
        // Game state variables
        this.colors = ['red', 'blue', 'green', 'yellow'];
        this.symbols = ['★', '■', '▲', '●', '♦', '⬡', '⬢', '▼'];
        this.cards = [];
        this.selectedCards = [];
        this.level = 0;
        this.score = 0;
        this.gameStarted = false;
        this.isRevealed = false;
        this.timer = null;
    
        // DOM elements
        this.startScreen = document.getElementById('startScreen');
        this.gameScreen = document.getElementById('gameScreen');
        this.startButton = document.getElementById('startButton');
        this.cardGrid = document.getElementById('cardGrid');
        this.messageEl = document.getElementById('message');
        this.levelInfoEl = document.getElementById('levelInfo');
        this.endScreen = document.getElementById('endScreen');
        this.finalScoreEl = document.getElementById('finalScore');
        this.restartButton = document.getElementById('restartButton');
        this.timerEl = document.getElementById('timer');
        this.quitButton = document.getElementById('quitButton');
    
        // Event listeners
        this.startButton.addEventListener('click', () => {
            this.startScreen.style.display = 'none';
            this.gameScreen.style.display = 'block';
            this.initializeGame();
        });
        this.restartButton.addEventListener('click', () => this.restartGame());
        this.quitButton.addEventListener('click', () => this.quitGame());
        
    }

    startTimer() {
        let timeLimit = Math.max(60 - this.level * 15, 10);
        this.timerEl.style.display = 'block';  
        this.timerEl.textContent = `Time Left: ${timeLimit}s`;
    
        if (this.timer) clearInterval(this.timer);
        this.timer = setInterval(() => {
            timeLimit--;
            this.timerEl.textContent = `Time Left: ${timeLimit}s`;
    
            if (timeLimit <= 0) {
                clearInterval(this.timer);
                this.timerEl.style.display = 'none'; // Hide timer
    
                if (this.level + 1 < this.colors.length) {
                    this.level++; // Move to the next level
                    this.updateMessage("Time’s up! Moving to the next level...");
                    setTimeout(() => this.startLevel(), 2000);
                } else {
                    this.showEndScreen(); // If it's the last level, end the game
                }
            }
        }, 1000);
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
        this.timerEl.style.display = 'none'; // Hide timer before each level starts
        
        this.cards = this.createLevelCards();
        this.selectedCards = [];
        this.isRevealed = true;
        this.renderCards();
        this.updateMessage(`Level ${this.level + 1}: Find 3 matching ${this.colors[this.level]} cards`);
        this.updateLevelInfo();
    
        let revealTime = Math.max(5000 - this.level * 1000, 1000); 
        let countdownTime = revealTime / 1000; 
    
        const countdownEl = document.getElementById('countdown');
        countdownEl.textContent = `Memorize: ${countdownTime}s`;
    
        const countdownInterval = setInterval(() => {
            countdownTime--;
            countdownEl.textContent = `Memorize: ${countdownTime}s`;
            if (countdownTime <= 0) clearInterval(countdownInterval);
        }, 1000);
    
        setTimeout(() => {
            this.isRevealed = false;
            this.renderCards();
            countdownEl.textContent = '';
    
            // Start level timer AFTER memorization ends
            this.startTimer();
        }, revealTime);
    }
    
    renderCards() {
        const eyeSpySVG = `<svg width="137" height="80" viewBox="0 0 207 125" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M65.1619 61.8185C62.8557 62.1251 61.5379 61.0399 61.2086 58.5629C61.0269 57.1963 61.2809 55.511 61.9706 53.5069C62.6603 51.5029 63.7572 49.2926 65.2613 46.876C66.8081 44.4538 68.7336 41.9378 71.0377 39.3279L71.0418 39.8489C64.6122 34.9668 59.6401 30.5863 56.1255 26.7074C52.6535 22.8228 50.7103 19.3217 50.2958 16.2041C50.0914 14.6667 50.3167 13.4198 50.9719 12.4634C51.6698 11.5014 52.6806 10.9324 54.0046 10.7563C56.8232 10.3815 59.8931 12.0595 63.2142 15.7903C66.5353 19.5211 69.9908 25.4071 73.5808 33.4484L73.8371 33.4143C74.2902 24.4008 75.1624 17.7221 76.4536 13.378C77.7392 8.99128 79.6419 6.63039 82.1616 6.29536C83.3574 6.13637 84.2897 6.44703 84.9584 7.22735C85.6642 7.95928 86.1165 9.07263 86.3152 10.5674C86.4799 11.8059 86.4209 13.487 86.1383 15.6108C85.8927 17.6861 85.4491 20.0703 84.8076 22.7634C84.2031 25.408 83.4419 28.1821 82.5241 31.0858C81.649 33.9837 80.6401 36.8559 79.4975 39.7025C76.6108 47.0837 74.0322 52.5334 71.7619 56.0514C69.4972 59.6122 67.2972 61.5346 65.1619 61.8185Z" fill="#FFD23F"/>
            <path d="M140.291 122.307C137.97 122.462 136.726 121.293 136.559 118.8C136.467 117.425 136.83 115.759 137.649 113.805C138.468 111.85 139.707 109.716 141.366 107.403C143.067 105.087 145.153 102.702 147.623 100.248L147.593 100.768C141.495 95.4765 136.82 90.7808 133.566 86.6807C130.355 82.5777 128.645 78.9573 128.434 75.8192C128.331 74.2717 128.637 73.0422 129.353 72.1306C130.112 71.2162 131.158 70.7144 132.491 70.6252C135.328 70.4352 138.282 72.31 141.352 76.2497C144.423 80.1893 147.487 86.2883 150.544 94.5468L150.802 94.5295C151.843 85.5649 153.149 78.9573 154.721 74.7068C156.29 70.4134 158.343 68.1817 160.879 68.0119C162.083 67.9313 162.993 68.3022 163.609 69.1245C164.266 69.9009 164.644 71.0414 164.745 72.546C164.829 73.7926 164.66 75.4663 164.239 77.5671C163.859 79.622 163.26 81.9721 162.444 84.6175C161.669 87.2171 160.728 89.9356 159.623 92.7731C158.56 95.6077 157.366 98.408 156.04 101.174C152.677 108.351 149.749 113.621 147.253 116.983C144.761 120.388 142.44 122.163 140.291 122.307Z" fill="#FFD23F"/>
            <path d="M98.2221 59.5436C99.3593 59.7886 100.162 60.6667 100.629 62.1778C101.106 63.6467 101.183 65.8449 100.861 68.7723L99.2757 69.6868C100.669 66.902 102.566 64.9528 104.965 63.8392C107.364 62.7256 109.975 62.4728 112.797 63.0808C115.408 63.6435 117.579 64.8165 119.31 66.5998C121.042 68.3832 122.181 70.7661 122.728 73.7487C123.327 76.6983 123.186 80.2157 122.305 84.301C120.88 90.9132 118.627 95.54 115.546 98.1815C112.516 100.79 108.958 101.654 104.873 100.774C101.925 100.138 99.7447 99.0075 98.3323 97.381C96.9199 95.7545 96.0719 93.9631 95.7883 92.0069L96.6281 91.7912C96.4205 94.3908 96.1543 96.9557 95.8294 99.4859C95.5557 101.983 95.2192 104.158 94.8199 106.011C94.4115 107.907 93.7298 109.434 92.7746 110.595C91.8194 111.755 90.6047 112.177 89.1307 111.859C87.6987 111.55 86.7427 110.771 86.2627 109.522C85.7827 108.273 85.5693 106.706 85.6226 104.823C85.7693 102.915 86.0293 100.481 86.4028 97.5208C86.7763 94.5603 87.2418 91.3773 87.7994 87.9717C88.3991 84.5751 89.0438 81.2765 89.7335 78.0756C90.4414 74.7906 91.2091 71.7388 92.0368 68.9202C92.9157 66.0687 93.7188 63.7737 94.4459 62.0353C94.9676 61.0459 95.5146 60.3484 96.0868 59.9429C96.7101 59.5043 97.4219 59.3712 98.2221 59.5436ZM108.641 69.7878C106.367 69.2977 104.29 70.0401 102.41 72.0149C100.581 73.9566 99.2903 76.6753 98.5371 80.171C97.7657 83.7508 97.8632 86.5704 98.8298 88.6297C99.8385 90.6981 101.438 91.9682 103.628 92.4401C106.155 92.9847 108.179 92.3852 109.701 90.6417C111.273 88.8651 112.405 86.3764 113.094 83.1756C113.975 79.0903 113.924 75.9503 112.943 73.7556C111.97 71.5188 110.536 70.1962 108.641 69.7878Z" fill="#FFD23F"/>
            <path d="M73.7795 69.1763C77.4769 70.1921 79.9873 71.4627 81.3108 72.9879C82.6342 74.5132 83.0619 76.1275 82.594 77.8307C82.32 78.8278 81.7386 79.5616 80.8498 80.0323C80.0139 80.4728 78.9728 80.5219 77.7265 80.1795C76.4386 79.8257 75.1398 79.2678 73.8301 78.5058C72.5618 77.7553 71.0138 77.1289 69.1859 76.6267C67.0671 76.0446 65.3744 76.0263 64.1075 76.5718C62.8406 77.1174 62.0303 78.034 61.6765 79.3219C61.3455 80.5267 61.5399 81.6077 62.2598 82.565C63.0327 83.4923 64.7029 84.4873 67.2704 85.5501C70.1287 86.6928 72.4106 87.9006 74.1161 89.1734C75.8746 90.4161 77.0319 91.8957 77.5879 93.6123C78.1554 95.2873 78.0967 97.3711 77.4118 99.8637C76.3275 103.81 74.1312 106.357 70.8227 107.503C67.5143 108.649 63.409 108.549 58.5068 107.202C55.3911 106.346 52.9877 105.418 51.2968 104.417C49.6058 103.416 48.4705 102.345 47.8907 101.203C47.3525 100.072 47.2546 98.8833 47.597 97.637C47.8937 96.5568 48.4751 95.823 49.3412 95.4354C50.2601 95.0177 51.2182 94.9458 52.2152 95.2197C53.1707 95.4823 54.1543 95.8865 55.1659 96.4326C56.189 96.937 57.2687 97.4794 58.4049 98.0597C59.5412 98.6399 60.7533 99.107 62.0411 99.4608C66.1955 100.602 68.6265 99.885 69.3341 97.3093C69.5738 96.4369 69.5601 95.6736 69.2931 95.0194C69.026 94.3652 68.3981 93.7235 67.4093 93.0944C66.4319 92.4238 64.9331 91.6992 62.913 90.9208C60.4889 89.9867 58.4427 88.9778 56.7746 87.894C55.1179 86.7686 53.9794 85.3835 53.359 83.7386C52.75 82.0522 52.7822 79.9835 53.4556 77.5324C54.5171 73.6689 56.8272 70.9526 60.3858 69.3836C63.9558 67.773 68.4204 67.7039 73.7795 69.1763Z" fill="#FFD23F"/>
            <circle cx="116.259" cy="27.145" r="5.55366" transform="rotate(6.58626 116.259 27.145)" fill="#EFEFD0"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M114.379 16.6777C115.711 16.8523 117.058 17.1555 118.422 17.5873C119.708 17.9944 120.866 18.4577 121.896 18.9771C122.659 18.0144 123.646 17.0176 124.81 16.0943C128.306 13.3223 132.081 12.2619 133.022 13.4487C133.963 14.6355 132.07 18.0694 128.574 20.8415C127.81 21.4473 127.033 21.9714 126.275 22.4082C126.6 22.8298 126.882 23.2704 127.12 23.7299C128.537 26.3927 128.725 29.367 127.685 32.6529C126.853 35.2817 125.433 37.3402 123.425 38.8286C121.472 40.289 119.121 41.149 116.372 41.4087C113.624 41.6684 110.668 41.2977 107.505 40.2965C105.739 39.7374 104.106 38.9719 102.606 38C101.582 37.3366 100.659 36.6209 99.8371 35.8529C99.0902 38.5255 99.3819 40.736 100.712 42.4843C102.129 44.2887 104.502 45.7174 107.829 46.7706C110.416 47.5897 112.562 48.0204 114.266 48.0627C115.97 48.105 117.42 48.0898 118.618 48.0171C119.829 47.9033 120.948 48.009 121.975 48.334C122.55 48.5161 123.012 48.8429 123.359 49.3145C123.761 49.7581 124.015 50.3129 124.12 50.9789C124.267 51.658 124.21 52.4082 123.95 53.2297C123.56 54.4619 122.567 55.4581 120.971 56.2181C119.387 56.937 117.267 57.2826 114.61 57.2548C112.006 57.1989 108.959 56.6184 105.468 55.5132C100.908 54.0699 97.488 52.2415 95.2061 50.0279C92.9243 47.8143 91.5909 45.2457 91.2059 42.322C90.8209 39.3984 91.1875 36.1704 92.3057 32.638C93.7229 28.1609 95.7471 24.6216 98.3783 22.0201C98.7323 21.6734 99.0929 21.3429 99.4602 21.0287C98.0281 20.2745 96.3227 18.8464 94.8136 16.9432C92.0415 13.4476 90.9812 9.67264 92.1679 8.73154C93.3547 7.79045 96.7887 9.68317 99.5607 13.1789C101.145 15.1763 102.17 17.265 102.536 18.864C104.115 17.971 105.797 17.3277 107.58 16.9343C108.224 16.7963 108.873 16.6912 109.525 16.6189C109.265 15.2113 109.198 13.4719 109.412 11.6157C109.924 7.18377 111.844 3.76471 113.348 3.93843C114.853 4.11216 115.943 7.87868 115.431 12.3106C115.242 13.9479 114.861 15.4469 114.379 16.6777ZM115.881 34.6102C113.724 35.2833 111.188 35.1583 108.272 34.2351C106.259 33.598 104.775 32.7894 103.82 31.8092C102.919 30.801 102.657 29.7013 103.035 28.5101C103.464 27.1547 104.291 26.0384 105.518 25.1614C106.745 24.2844 108.228 23.7373 109.969 23.5201C111.764 23.2749 113.627 23.4578 115.557 24.0689C117.611 24.719 118.961 25.6659 119.606 26.9097C120.306 28.1254 120.428 29.452 119.973 30.8896C119.401 32.6969 118.037 33.9371 115.881 34.6102Z" fill="#FFD23F"/>
            <circle cx="35.584" cy="35.8103" r="5.55366" transform="rotate(2.03026 35.584 35.8103)" fill="#EFEFD0"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M26.4688 27.0966C27.6449 26.4491 28.9104 25.8955 30.2653 25.4357C31.5426 25.0023 32.7499 24.69 33.8874 24.4988C33.9323 23.271 34.1371 21.8835 34.5286 20.4499C35.7042 16.1462 38.1182 13.0564 39.5793 13.4555C41.0404 13.8546 41.5486 17.7425 40.3731 22.0463C40.1161 22.987 39.8 23.8697 39.4476 24.6707C39.9592 24.818 40.4471 25.0062 40.9115 25.2353C43.6298 26.5422 45.5427 28.8276 46.6502 32.0915C47.5362 34.7025 47.611 37.2022 46.8745 39.5904C46.165 41.9239 44.7798 44.0091 42.7188 45.8458C40.6578 47.6826 38.0566 49.134 34.9151 50.1999C33.1608 50.7952 31.3915 51.1454 29.6073 51.2504C28.3895 51.322 27.2219 51.2918 26.1045 51.1598C27.0852 53.7558 28.6291 55.3644 30.7364 55.9855C32.9468 56.6003 35.7044 56.347 39.009 55.2257C41.5793 54.3535 43.5635 53.43 44.9615 52.4551C46.3595 51.4803 47.5197 50.6089 48.442 49.841C49.3505 49.0322 50.3147 48.4548 51.3347 48.1087C51.9058 47.9149 52.4712 47.9051 53.0307 48.0792C53.6172 48.1986 54.1501 48.4955 54.6295 48.9697C55.1497 49.4302 55.5483 50.0684 55.8252 50.8843C56.2405 52.1083 56.03 53.4991 55.1937 55.0567C54.3435 56.5736 52.8395 58.1076 50.6816 59.6588C48.5507 61.1553 45.7513 62.4919 42.2834 63.6687C37.7549 65.2054 33.9158 65.7574 30.7663 65.3247C27.6168 64.8921 25.0213 63.6118 22.9798 61.4838C20.9383 59.3558 19.3223 56.5375 18.1317 53.0288C16.6227 48.5818 16.1581 44.5311 16.7379 40.8767C16.8179 40.3877 16.9128 39.9078 17.0228 39.4371C15.4221 39.6773 13.2022 39.5363 10.8592 38.8963C6.55543 37.7208 3.46566 35.3068 3.86475 33.8456C4.26383 32.3845 8.15178 31.8764 12.4555 33.0519C14.9147 33.7236 16.9775 34.7997 18.2196 35.8713C18.9633 34.2166 19.9373 32.7027 21.1416 31.3297C21.5789 30.837 22.0391 30.3684 22.5221 29.9238C21.4789 28.9436 20.3953 27.5814 19.4689 25.9589C17.257 22.0845 16.7792 18.1927 18.0945 17.4417C19.4099 16.6908 22.5184 19.0806 24.7304 22.955C25.5475 24.3863 26.128 25.8199 26.4688 27.0966ZM38.297 40.6584C36.958 42.4776 34.8402 43.8787 31.9435 44.8616C29.9444 45.54 28.2699 45.767 26.9199 45.5427C25.5968 45.2637 24.7345 44.5326 24.3331 43.3495C23.8762 42.0031 23.8824 40.6134 24.3515 39.1804C24.8206 37.7473 25.6923 36.4279 26.9664 35.2221C28.2676 33.9616 29.8769 33.0061 31.7944 32.3554C33.8343 31.6632 35.4826 31.6271 36.7394 32.247C38.0231 32.8123 38.9073 33.8089 39.3918 35.2369C40.0009 37.032 39.636 38.8392 38.297 40.6584Z" fill="#FFD23F"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M171.207 51.25C161.454 55.6245 150 51.2637 145.626 41.5098C141.251 31.7558 145.612 20.3025 155.366 15.928C165.12 11.5535 176.573 15.9144 180.948 25.6683C185.322 35.4222 180.961 46.8755 171.207 51.25ZM172.111 57.4234C159.67 62.0434 145.607 56.2741 140.098 43.989C134.354 31.182 140.08 16.1437 152.887 10.4C165.694 4.65623 180.732 10.3821 186.476 23.1891C191.527 34.4509 187.708 47.4381 178.005 54.3135C182.246 58.851 188.09 68.1921 193.203 79.5923C200.862 96.6683 203.978 111.898 200.886 113.284C197.794 114.671 188.494 102.215 180.836 85.139C175.844 74.0085 172.782 63.6626 172.111 57.4234Z" fill="#EFEFD0"/>
        </svg>`;

        this.cardGrid.innerHTML = '';
        this.cards.forEach(card => {
            const cardEl = document.createElement('div');
            cardEl.classList.add('card');
            
            if (this.isRevealed || card.isFlipped) {
                cardEl.classList.add('revealed');
                cardEl.style.color = card.color;
                cardEl.textContent = card.symbol;
            } else {
                cardEl.innerHTML = eyeSpySVG;
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
            clearInterval(this.timer); // Stop timer when level is completed
            this.score++;
    
            if (this.level + 1 < this.colors.length) {
                this.level++;
                this.updateMessage('Great job! Starting next level...');
                setTimeout(() => this.startLevel(), 2000);
            } else {
                this.showEndScreen(); 
            }
        } else {
            this.selectedCards.forEach(card => (card.isFlipped = false));
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

    showEndScreen() {
        this.gameStarted = false;
        this.gameScreen.style.display = 'none';  
        this.endScreen.style.display = 'block';  
        this.finalScoreEl.textContent = `Final Score: ${this.score}/${this.colors.length}`;
    
        clearInterval(this.timer);  // Stop timer when game ends
        this.timerEl.style.display = 'none';  // Hide timer
    }
    
    restartGame() {
        this.endScreen.style.display = 'none';  // Hide end screen
        this.startScreen.style.display = 'block'; // Show start screen
        this.level = 0;
        this.score = 0;
        this.gameStarted = false;
    }

    quitGame() {
        this.gameStarted = false;
        clearInterval(this.timer); // Stop any running timer
        this.gameScreen.style.display = 'none'; // Hide game screen
        this.startScreen.style.display = 'block'; // Show home screen
        location.reload(); // Resets the game completely
    }
    
}

// Initialize the game
new EyeSpy();